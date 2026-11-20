import { useRef, useState } from "react";
import { SportsPicture } from "./SportsPicture";
import { scramble, type VocabularyItem } from "./vocabulary";
import styles from "./sports.module.css";

const foodGroups = [
  { label: "Energy", foods: ["bread", "potatoes", "olive oil", "rice", "pasta"] },
  { label: "Vitamins & Fibre", foods: ["lettuce", "watermelon", "tomato", "orange", "broccoli", "pepper", "apple", "banana"] },
  { label: "Growth", foods: ["eggs", "lentils", "fish", "meat", "cheese"] },
];

export function getGroupedFoods(vocabulary: VocabularyItem[]) {
  const groups = foodGroups.map(({ label, foods }) =>
    vocabulary.filter(({ word, picture }) => foods.includes(word) && picture?.startsWith("/"))
      .map((item) => ({ ...item, group: label })));

  if (groups.some((foods) => foods.length === 0)) return [];
  return Array.from({ length: Math.max(...groups.map((foods) => foods.length)) },
    (_, index) => groups.flatMap((foods) => foods.slice(index, index + 1))).flat();
}

export function FoodGroupRound({ mode, vocabulary, round, onAnswer, onNext }: {
  mode: "food-sort" | "food-find";
  vocabulary: VocabularyItem[];
  round: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const answered = useRef(false);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const item = vocabulary[round]!;
  const sorting = mode === "food-sort";
  const labels = foodGroups.map(({ label }) => label);

  function check(correct: boolean) {
    if (answered.current) return;
    answered.current = correct;
    setFeedback(correct ? "correct" : "retry");
    onAnswer(correct);
  }

  return (
    <>
      <p className={styles.prompt}>{sorting ? "¿A qué grupo pertenece este alimento?" : "¿Qué alimento pertenece a este grupo?"}</p>
      {sorting ? (
        <>
          <SportsPicture item={item} />
          <p className={styles.prompt} lang="en"><strong>{item.word}</strong></p>
          <div className={styles.choices} lang="en">
            {labels.map((label) => (
              <button key={label} type="button" className={styles.tile} disabled={feedback === "correct"}
                onClick={() => check(label === item.group)}>{label}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className={styles.prompt} lang="en"><strong>{item.group}</strong></p>
          <div className={styles.foodChoices}>
            {scramble(labels.map((label) =>
              label === item.group ? item : scramble(vocabulary.filter(({ group }) => group === label), round + 7)[0]!,
            ), round + 21).map((option) => (
              <button key={option.word} type="button" className={`${styles.tile} ${styles.foodChoice}`}
                disabled={feedback === "correct"} onClick={() => check(option === item)}>
                <SportsPicture item={option} />
                <span lang="en">{option.word}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <p className={styles.feedback} role="status">
        {feedback === "correct" ? "¡Muy bien!" : feedback === "retry" ? "Casi. ¡Inténtalo otra vez!" : ""}
      </p>
      {feedback === "correct" && <button className={styles.primary} onClick={onNext}>Continuar →</button>}
    </>
  );
}

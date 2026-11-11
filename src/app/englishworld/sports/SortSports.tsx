import { useState } from "react";
import { sportsVocabulary } from "./vocabulary";
import styles from "./sports.module.css";

const groups = ["Play", "Go", "Do", "Wear"] as const;
type Group = (typeof groups)[number];

const sortPhrases: Record<string, { group: Group; phrase: string }> = {
  swimming: { group: "Go", phrase: "go swimming" },
  cycling: { group: "Go", phrase: "go cycling" },
  skateboarding: { group: "Go", phrase: "go skateboarding" },
  bat: { group: "Play", phrase: "play baseball with a bat" },
  racket: { group: "Play", phrase: "play tennis with a racket" },
  helmet: { group: "Wear", phrase: "wear a helmet" },
  gloves: { group: "Wear", phrase: "wear gloves" },
  "knee pads": { group: "Wear", phrase: "wear knee pads" },
  "elbow pads": { group: "Wear", phrase: "wear elbow pads" },
  gymnastics: { group: "Do", phrase: "do gymnastics" },
};

export const sortWords = [...sportsVocabulary.map(({ word }) => word), "gymnastics"];

export function SortSports({ round, onAnswer, onNext }: {
  round: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const word = sortWords[round]!;
  const answer = sortPhrases[word] ?? { group: "Play", phrase: `play ${word}` };
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const correct = feedback === "correct";

  function choose(group: Group) {
    if (correct) return;
    const matches = group === answer.group;
    setFeedback(matches ? "correct" : "retry");
    onAnswer(matches);
  }

  return (
    <>
      <p className={styles.prompt}>Elige el verbo que completa la frase.</p>
      <p className={styles.sortWord} lang="en">{correct ? answer.phrase : answer.phrase.replace(/^\w+/, "___")}</p>
      <div className={styles.sortGroups} aria-label="Grupos" role="group" lang="en">
        {groups.map((group) => (
          <button type="button" key={group} className={styles.tile} data-group={group}
            data-correct={correct && group === answer.group} disabled={correct}
            onClick={() => choose(group)}>{group}</button>
        ))}
      </div>
      <p className={styles.feedback} role="status">
        {correct ? "¡Muy bien!"
          : feedback === "retry" ? "Casi. ¡Prueba con otro grupo!" : ""}
      </p>
      {correct && <button className={styles.primary} onClick={onNext} lang="en">Next →</button>}
    </>
  );
}

import { useState } from "react";
import type { VocabularyItem } from "./vocabulary";
import styles from "./sports.module.css";

const sportsGroups = ["Play", "Go", "Do", "Wear"];
const seasonsGroups = ["Weather", "Season", "Activity"];

export function SortWords({ item, unit, onAnswer, onNext }: {
  item: VocabularyItem;
  unit: "sports" | "seasons";
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const sports = unit === "sports";
  const groups = sports ? sportsGroups : seasonsGroups;
  const phrase = item.sortPhrase ?? item.word;
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const correct = feedback === "correct";

  function choose(group: string) {
    if (correct) return;
    const matches = group === item.group;
    setFeedback(matches ? "correct" : "retry");
    onAnswer(matches);
  }

  return (
    <>
      <p className={styles.prompt}>{sports ? "Elige el verbo que completa la frase." : "Elige el grupo al que pertenece la palabra."}</p>
      <p className={styles.sortWord} lang="en">{correct || !sports ? phrase : phrase.replace(/^\w+/, "___")}</p>
      <div className={styles.sortGroups} aria-label="Grupos" role="group" lang="en">
        {groups.map((group) => (
          <button type="button" key={group} className={styles.tile} data-group={group}
            data-correct={correct && group === item.group} disabled={correct}
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

import Link from "next/link";
import { UnitGames } from "./UnitGames";
import type { VocabularyItem } from "./vocabulary";
import styles from "./sports.module.css";

export function UnitPage({ title, vocabulary, unit }: {
  title: string;
  vocabulary: VocabularyItem[];
  unit: "sports" | "seasons";
}) {
  return (
    <div className={styles.page}>
      <Link href="/englishworld" className={styles.back}>← Volver a English World</Link>
      <header className={styles.hero}>
        <span className={styles.controller} aria-hidden="true">🎮</span>
        <h1 lang="en">{title}</h1>
        <p>Elige un juego y practica inglés.</p>
      </header>
      <UnitGames vocabulary={vocabulary} unit={unit} />
    </div>
  );
}

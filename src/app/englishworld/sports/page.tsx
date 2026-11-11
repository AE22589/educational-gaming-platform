import type { Metadata } from "next";
import Link from "next/link";
import { SportsGames } from "./SportsGames";
import styles from "./sports.module.css";

export const metadata: Metadata = {
  title: "Let’s Play Sports! · CHISPITAS",
  description: "Practica vocabulario de deportes en inglés con seis juegos.",
};

export default function SportsPage() {
  return (
    <div className={styles.page}>
      <Link href="/englishworld" className={styles.back}>← Volver a English World</Link>
      <header className={styles.hero}>
        <span className={styles.controller} aria-hidden="true">🎮</span>
        <h1 lang="en">Let’s Play Sports!</h1>
        <p>Elige un juego y practica inglés.</p>
      </header>
      <SportsGames />
    </div>
  );
}

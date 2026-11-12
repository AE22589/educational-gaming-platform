import Link from "next/link";
import Image from "next/image";
import { englishUnits } from "./units";
import styles from "./english-world.module.css";

export default function EnglishWorldPage() {
  return (
    <section className={styles.world} aria-labelledby="english-world-title">
      <header className={styles.heading}>
        <p className="chispitas-eyebrow">Elige tu próxima aventura</p>
        <h1 id="english-world-title" lang="en">English World</h1>
        <p>Explora {englishUnits.length} unidades y descubre palabras nuevas en inglés.</p>
      </header>
      <div className={`english-unit-grid ${styles.grid} ${styles.englishGrid}`}>
        {englishUnits.map((unit) => (
          <article className={`home-tile ${styles.unitCard}`} key={unit.slug}>
            <div className={styles.art}>
              <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${unit.image}`} alt={unit.imageLabel} width={330} height={345} unoptimized />
            </div>
            <div className={`home-tile-copy ${styles.copy}`}>
              <h2 id={`unit-${unit.slug}`} className="home-tile-title" lang="en">{unit.title}</h2>
              <p className="home-tile-description">{unit.description}</p>
              <Link
                href={`/englishworld/${unit.slug}`}
                className={`home-tile-button ${styles.button}`}
                aria-describedby={`unit-${unit.slug}`}
              >
                Explore this topic <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getSectionTone, type CurriculumUnit, type World } from "@/features/curriculum/catalog";
import styles from "../englishworld/english-world.module.css";
import scienceStyles from "../scienceworld/science-world.module.css";
import { getUnitActivity } from "./unit-activity";

export function WorldCatalog({ world, title, units }: {
  world: World;
  title: string;
  units: Pick<CurriculumUnit, "id" | "bookId" | "title" | "language" | "description" | "image" | "games">[];
}) {
  const titleId = `${world}-title`;

  return (
    <section className={styles.world} aria-labelledby={titleId}>
      <header className={`${styles.heading} ${styles.catalogHeading}`}>
        <Link href="/" className={`page-back-link ${styles.catalogBack}`}>
          <span aria-hidden="true">←</span> Volver al inicio
        </Link>
        <h1 id={titleId} lang="en">{title}</h1>
      </header>
      {!units.length && <p role="status">Pronto habrá unidades disponibles.</p>}
      <div className={`${world === "englishworld" ? "english-unit-grid" : "science-unit-grid"} ${styles.grid}${world === "scienceworld" ? ` ${styles.scienceGrid}` : ""}`}>
        {units.map((unit) => {
          const playable = getUnitActivity(unit) !== null;
          return (
            <article className={`home-tile ${styles.sectionTone} ${styles.unitCard} ${world === "scienceworld" ? scienceStyles.card : ""}`} key={unit.id} data-playable={playable} data-section-tone={getSectionTone(unit)}>
              <div className={styles.art}>
                {unit.image
                  ? <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${unit.image}`} alt="" width={330} height={345} unoptimized />
                  : <span className={scienceStyles.illustration} aria-hidden="true">📚</span>}
              </div>
              <div className={`home-tile-copy ${styles.copy} ${scienceStyles.copy}`}>
                <h2 id={`unit-${unit.id}`} className="home-tile-title" lang={unit.language}>{unit.title}</h2>
                {unit.description && <p className="home-tile-description">{unit.description}</p>}
                {playable ? (
                  <Link href={`/unit/${unit.id}/`} className={`home-tile-button ${styles.button} ${styles.sectionLink}`}
                    aria-describedby={`unit-${unit.id}`} lang="en">
                    Explore this topic <span aria-hidden="true">→</span>
                  </Link>
                ) : <span className={`home-tile-button is-muted ${styles.button}`}>Próximamente</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

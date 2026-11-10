import Link from "next/link";
import Image from "next/image";
import styles from "../englishworld/english-world.module.css";
import scienceStyles from "../scienceworld/science-world.module.css";

type WorldUnit = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  imageLabel: string;
  icon: string;
};

type WorldCatalogProps = {
  world: "englishworld" | "scienceworld";
  title: string;
  description: string;
  units: readonly WorldUnit[];
};

export function WorldCatalog({ world, title, description, units }: WorldCatalogProps) {
  const titleId = `${world}-title`;
  return (
    <section className={styles.world} aria-labelledby={titleId}>
      <header className={styles.heading}>
        <p className="chispitas-eyebrow">Elige tu próxima aventura</p>
        <h1 id={titleId} lang="en">{title}</h1>
        <p>{description}</p>
      </header>
      <div className={`${world === "englishworld" ? "english-unit-grid" : "science-unit-grid"} ${styles.grid}`}>
        {units.map((unit) => (
          <article className={`home-tile ${styles.unitCard} ${world === "scienceworld" ? scienceStyles.card : ""}`} key={unit.slug}>
            <div className={styles.art}>
              {unit.image ? (
                <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${unit.image}`} alt={unit.imageLabel} width={330} height={345} unoptimized />
              ) : (
                <span className={scienceStyles.illustration} role="img" aria-label={unit.imageLabel}>{unit.icon}</span>
              )}
            </div>
            <div className={`home-tile-copy ${styles.copy} ${scienceStyles.copy}`}>
              <h2 id={`unit-${unit.slug}`} className="home-tile-title" lang="en">{unit.title}</h2>
              <p className="home-tile-description">{unit.description}</p>
              <Link
                href={`/${world}/${unit.slug}`}
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

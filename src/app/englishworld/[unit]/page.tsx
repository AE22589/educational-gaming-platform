import Link from "next/link";
import { notFound } from "next/navigation";
import { englishUnits } from "../units";
import { getUnitVocabulary } from "../workbook";
import styles from "../english-world.module.css";

export function generateStaticParams() {
  return englishUnits.filter(({ slug }) => slug !== "sports" && slug !== "seasons").map(({ slug }) => ({ unit: slug }));
}

export default async function EnglishUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit: slug } = await params;
  const unit = englishUnits.find((entry) => entry.slug === slug);
  if (!unit) notFound();
  const vocabulary = await getUnitVocabulary(unit.title);

  return (
    <section className={`coming-soon tone-lilac ${styles.preview}`}>
      <p className="chispitas-eyebrow">Unidad en preparación</p>
      <h1 lang="en">{unit.title}</h1>
      <div className="coming-soon-card">
        <div className={styles.art}>
          <span role="img" aria-label={unit.imageLabel}>{unit.icon}</span>
          <small>Imagen provisional</small>
        </div>
        <div className="coming-soon-copy">
          <p>{unit.description}</p>
          <p>¡Las actividades estarán disponibles pronto!</p>
        </div>
      </div>
      <h2>Vocabulario de la unidad</h2>
      <dl className={styles.vocabulary}>
        {vocabulary.map(({ word, translation }) => (
          <div key={word}>
            <dt lang="en">{word}</dt>
            <dd>{translation}</dd>
          </div>
        ))}
      </dl>
      <Link className={`home-tile-button ${styles.button}`} href="/englishworld">
        Volver a las unidades
      </Link>
    </section>
  );
}

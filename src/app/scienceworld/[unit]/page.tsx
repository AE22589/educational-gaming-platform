import Link from "next/link";
import { notFound } from "next/navigation";
import { scienceUnits } from "../units";
import styles from "../../englishworld/english-world.module.css";

export function generateStaticParams() {
  return scienceUnits.filter(({ slug }) => slug !== "body").map(({ slug }) => ({ unit: slug }));
}

export default async function ScienceUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit: slug } = await params;
  const unit = scienceUnits.find((entry) => entry.slug === slug);
  if (!unit) notFound();

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
      <Link className={`home-tile-button ${styles.button}`} href="/scienceworld">
        Volver a las unidades
      </Link>
    </section>
  );
}

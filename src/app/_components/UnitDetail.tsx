import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getSectionTone, units } from "@/features/curriculum/catalog";
import { getSectionTranslation } from "@/features/curriculum/section-translations";
import { UnitGames } from "../englishworld/sports/UnitGames";
import { getPictureMatchVocabulary, getPracticeVocabulary } from "../englishworld/sports/unit-content";
import practiceStyles from "../englishworld/sports/sports.module.css";
import styles from "../englishworld/english-world.module.css";
import { PrintWorksheetsLink } from "./PrintWorksheetsLink";
import { bodyGame, getUnitActivity, getVocabularyGames } from "./unit-activity";
import topicStyles from "./subsections.module.css";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function UnitDetail({ unitId, subsectionId }: { unitId: string; subsectionId?: string }) {
  const unit = units.find((entry) => entry.id === unitId);
  if (!unit) notFound();
  const subsection = unit.subsections.find(({ id }) => id === subsectionId);
  if (subsectionId && !subsection) notFound();
  const { world } = getBook(unit.bookId);
  const sectionHref = `/unit/${unit.id}/`;
  const translation = getSectionTranslation(unit.id);
  const printWorksheets = <PrintWorksheetsLink sectionId={unit.id} subsectionId={subsection?.stableId ?? subsection?.id} />;
  if (subsection) {
    const spanishTitle = subsection.spanishTitle || translation?.topics[subsection.id];
    const vocabulary = unit.vocabulary.filter(({ subsection: topic }) =>
      topic.toLowerCase() === subsection.title.toLowerCase() || topic.toLowerCase() === subsection.id);
    const games = getVocabularyGames(subsection.games ?? [], vocabulary);
    const practice = world === "scienceworld" ? "healthy-habits" : "vocabulary";

    return (
      <section className={topicStyles.page} aria-labelledby="curriculum-unit-title">
        <nav aria-label="Ruta de navegación" className={topicStyles.breadcrumb}>
          <ol>
            <li><Link href={sectionHref} lang={unit.language}>{unit.title}</Link></li>
            <li aria-current="page"><span aria-hidden="true">/</span> <span lang={unit.language}>{subsection.title}</span></li>
          </ol>
        </nav>
        <header className={topicStyles.heading}>
          <h1 id="curriculum-unit-title" lang={unit.language}>{subsection.title}</h1>
          {spanishTitle && <p lang="es">{spanishTitle}</p>}
          {subsection.image && <Image className={styles.unitImage} src={`${assetBase}${subsection.image}`}
            alt="" width={330} height={345} unoptimized />}
          {printWorksheets}
        </header>
        <Link href={sectionHref} className={topicStyles.back}><span aria-hidden="true">←</span> Volver a las subsecciones</Link>
        {games.length > 0 && vocabulary.length > 0 ? (
          <div className={practiceStyles.page}>
            <UnitGames unit={practice} vocabulary={getPracticeVocabulary({ ...unit, vocabulary }, practice)}
              pictureMatchVocabulary={getPictureMatchVocabulary(vocabulary)} availableGames={games} />
          </div>
        ) : (
          <section className={topicStyles.empty} aria-labelledby="subsection-games-title">
            <h2 id="subsection-games-title">Juegos</h2>
            <p>¡Las actividades estarán disponibles pronto!</p>
          </section>
        )}
      </section>
    );
  }

  if (unit.subsections.length) {
    return (
      <section className={topicStyles.page} aria-labelledby="curriculum-unit-title">
        <Link href={`/${world}/`} className={topicStyles.back}><span aria-hidden="true">←</span> Volver a las secciones</Link>
        <header className={topicStyles.heading}>
          <h1 id="curriculum-unit-title" lang={unit.language}>{unit.title}</h1>
          {(unit.spanishTitle || translation?.title) && <p lang="es">{unit.spanishTitle || translation?.title}</p>}
          {printWorksheets}
        </header>
        <section aria-label="Subsecciones" className={topicStyles.topics}>
          <h2>Elige un tema</h2>
          <ol role="list">
            {unit.subsections.map(({ id, title, spanishTitle }, index) => {
              const spanish = spanishTitle || translation?.topics[id];
              return (
                <li key={id}>
                  <Link href={`${sectionHref}subsection/${id}/`} className={topicStyles.topic}>
                    <span className={topicStyles.number} aria-hidden="true">{index + 1}</span>
                    <span className={topicStyles.label}>
                      <strong lang={unit.language}>{title}</strong>
                      {spanish && <span lang="es">{spanish}</span>}
                    </span>
                    <span className={topicStyles.arrow} aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </section>
    );
  }

  const activity = getUnitActivity(unit);
  const practice = activity === "body" ? "healthy-habits" : activity;
  const games = getVocabularyGames(unit.games, unit.vocabulary);
  const tone = getSectionTone(unit);

  return (
    <section className={practiceStyles.page} aria-labelledby="curriculum-unit-title">
      <Link href={`/${world}/`} className={practiceStyles.back}>
        <span aria-hidden="true">← </span>Volver a las secciones
      </Link>
      <header className={`${practiceStyles.hero} ${styles.sectionTone} ${styles.sectionHero}`}
        data-section-tone={world === "englishworld" ? tone : undefined}>
        {unit.image && <Image className={styles.unitImage} src={`${assetBase}${unit.image}`} alt="" width={330} height={345} unoptimized />}
        <h1 id="curriculum-unit-title" lang={unit.language}>{unit.title}</h1>
        {unit.description && <p>{unit.description}</p>}
        {printWorksheets}
      </header>
      {activity === "body" && <Link className={`home-tile-button ${styles.button}`} href="/scienceworld/body/">{bodyGame}</Link>}
      {practice && (activity !== "body" || unit.vocabulary.some(({ image }) => image)) &&
        <UnitGames unit={practice} vocabulary={getPracticeVocabulary(unit, practice)}
          pictureMatchVocabulary={getPictureMatchVocabulary(unit.vocabulary)} availableGames={games} />}
      {!activity && <p>¡Las actividades estarán disponibles pronto!</p>}
    </section>
  );
}

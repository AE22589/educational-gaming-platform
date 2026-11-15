import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getSectionTone, practiceIds, units } from "@/features/curriculum/catalog";
import healthyHabitsPractice from "@/features/curriculum/healthy-habits-practice.json";
import { UnitGames } from "../englishworld/sports/UnitGames";
import { getPracticeVocabulary } from "../englishworld/sports/unit-content";
import practiceStyles from "../englishworld/sports/sports.module.css";
import styles from "../englishworld/english-world.module.css";
import { bodyGame, getUnitActivity } from "./unit-activity";
import { SectionCards } from "./WorldCatalog";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function UnitDetail({ unitId, subsectionId }: { unitId: string; subsectionId?: string }) {
  const unit = units.find((entry) => entry.id === unitId);
  if (!unit) notFound();
  const subsection = unit.subsections.find(({ id }) => id === subsectionId);
  if (subsectionId && !subsection) notFound();
  const { world } = getBook(unit.bookId);
  const hasSubsections = unit.subsections.length > 0;
  const starterPractice = !subsection && unitId === practiceIds.healthyHabits && unit.games.length === 0;
  const practiceUnit = starterPractice ? { ...unit, ...healthyHabitsPractice } : unit;
  const activity = !subsection && (!hasSubsections || starterPractice) ? getUnitActivity(practiceUnit) : null;
  const tone = getSectionTone(unit);

  return (
    <section className={practiceStyles.page} aria-labelledby="curriculum-unit-title">
      <Link href={subsection ? `/unit/${unit.id}/` : `/${world}/`} className={practiceStyles.back}>
        <span aria-hidden="true">← </span>{subsection ? "Volver a las subsecciones" : "Volver a las secciones"}
      </Link>
      <header className={`${practiceStyles.hero} ${styles.sectionTone} ${styles.sectionHero}`}
        data-section-tone={world === "englishworld" ? tone : undefined}>
        {unit.image && <Image className={styles.unitImage} src={`${assetBase}${unit.image}`} alt="" width={330} height={345} unoptimized />}
        <h1 id="curriculum-unit-title" lang={unit.language}>{subsection?.title ?? unit.title}</h1>
        {!subsection && unit.description && <p>{unit.description}</p>}
      </header>
      {!subsection && hasSubsections && (
        <section aria-label="Subsecciones">
          <SectionCards world={world} subsections cards={unit.subsections.map(({ id, title }) => ({
            id, title, tone, language: unit.language, description: "", image: unit.image,
            href: `/unit/${unit.id}/subsection/${id}/`,
          }))} />
        </section>
      )}
      {subsection && (
        <section className={practiceStyles.play} aria-labelledby="subsection-games-title">
          <h2 id="subsection-games-title">Juegos</h2>
          <p>¡Las actividades estarán disponibles pronto!</p>
        </section>
      )}
      {activity === "body" ? <Link className={`home-tile-button ${styles.button}`} href="/scienceworld/body/">{bodyGame}</Link>
        : activity ? <UnitGames unit={activity} vocabulary={getPracticeVocabulary(practiceUnit, activity)} availableGames={practiceUnit.games} />
        : !subsection && !hasSubsections && <p>¡Las actividades estarán disponibles pronto!</p>}
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getSectionTone, units } from "@/features/curriculum/catalog";
import { UnitGames } from "../englishworld/sports/UnitGames";
import { getPracticeVocabulary } from "../englishworld/sports/unit-content";
import practiceStyles from "../englishworld/sports/sports.module.css";
import styles from "../englishworld/english-world.module.css";
import { bodyGame, getUnitActivity } from "./unit-activity";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function UnitDetail({ unitId }: { unitId: string }) {
  const unit = units.find((entry) => entry.id === unitId);
  if (!unit) notFound();
  const { world } = getBook(unit.bookId);
  const activity = getUnitActivity(unit);

  return (
    <section className={practiceStyles.page} aria-labelledby="curriculum-unit-title">
      <Link href={`/${world}/`} className={practiceStyles.back}><span aria-hidden="true">← </span>Volver a las secciones</Link>
      <header className={`${practiceStyles.hero} ${styles.sectionTone} ${styles.sectionHero}`}
        data-section-tone={world === "englishworld" ? getSectionTone(unit) : undefined}>
        {unit.image && <Image className={styles.unitImage} src={`${assetBase}${unit.image}`} alt="" width={330} height={345} unoptimized />}
        <h1 id="curriculum-unit-title" lang={unit.language}>{unit.title}</h1>
        {unit.description && <p>{unit.description}</p>}
      </header>
      {activity === "body" ? <Link className={`home-tile-button ${styles.button}`} href="/scienceworld/body/">{bodyGame}</Link>
        : activity ? <UnitGames unit={activity} vocabulary={getPracticeVocabulary(unit, activity)} availableGames={unit.games} />
        : <p>¡Las actividades estarán disponibles pronto!</p>}
    </section>
  );
}

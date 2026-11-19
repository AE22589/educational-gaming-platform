import { books, units, worksheets } from "@/features/curriculum/catalog";
import Image from "next/image";
import Link from "next/link";
import { WorksheetBrowser } from "./WorksheetBrowser";
import styles from "./worksheets.module.css";

export const metadata = {
  title: "Fichas de actividades para niños · Chispitas",
};

export default function WorksheetsPage() {
  return (
    <section className={`coming-soon ${styles.page}`} aria-labelledby="worksheets-title">
      <h1 id="worksheets-title">Fichas de actividades para niños</h1>
      <div className="coming-soon-card">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/homepage/worksheet-activities.webp`}
          alt="" width={170} height={170} unoptimized />
        <div className="coming-soon-copy">
          <WorksheetBrowser
            books={books}
            sections={units.map(({ id, bookId, title, language, spanishTitle, subsections }) => ({
              id, bookId, title: spanishTitle || title, language: spanishTitle ? "es" : language,
              subsections: subsections.map((topic) => ({
                id: topic.stableId ?? topic.id,
                title: topic.spanishTitle || topic.title,
                language: topic.spanishTitle ? "es" : language,
              })),
            }))}
            worksheets={worksheets}
          />
        </div>
      </div>
      <Link className="action" href="/">Volver al inicio</Link>
    </section>
  );
}

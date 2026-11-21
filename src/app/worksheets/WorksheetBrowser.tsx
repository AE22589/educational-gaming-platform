"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CurriculumUnit, Worksheet, World } from "@/features/curriculum/catalog";
import { getSectionWorksheets, isWorksheetPdf } from "@/features/curriculum/worksheet-files";
import { useSelectedGrade } from "@/features/homepage/grade-selection";
import styles from "./worksheets.module.css";

type Book = { id: string; world: string; grade: number; title: string };
type Section = Pick<CurriculumUnit, "id" | "bookId" | "title" | "language" | "spanishTitle"> & {
  subsections: { id: string; title: string; language: string }[];
};

function SectionTitle({ title, language, spanishTitle }: Pick<Section, "title" | "language" | "spanishTitle">) {
  if (!spanishTitle || spanishTitle === title) return <span lang={language}>{title}</span>;

  return (
    <span>
      <span lang="es">{spanishTitle}</span>{" "}
      <span className={styles.englishTitle} lang={language}>{title}</span>
    </span>
  );
}

const subjects = [
  { id: "englishworld", label: "Inglés" },
  { id: "scienceworld", label: "Ciencias" },
] as const;

type BrowserProps = {
  books: Book[]; sections: Section[]; worksheets: Worksheet[];
};

export function WorksheetBrowserFromUrl(props: BrowserProps) {
  const params = useSearchParams();
  const sectionId = params.get("section") ?? "";
  const topicId = params.get("topic") ?? "";
  return <WorksheetBrowser key={JSON.stringify([sectionId, topicId])} {...props}
    initialSectionId={sectionId} initialTopicId={topicId} />;
}

export function WorksheetBrowser({ books, sections, worksheets, initialSectionId, initialTopicId }:
  BrowserProps & { initialSectionId?: string; initialTopicId?: string }) {
  const initialSection = sections.find(({ id }) => id === initialSectionId);
  const initialBook = books.find(({ id }) => id === initialSection?.bookId);
  const initialWorld = subjects.find(({ id }) => id === initialBook?.world)?.id ?? null;
  const [world, setWorld] = useState<World | null>(initialWorld);
  const [gradeChoice, setGrade] = useState(initialBook?.grade);
  const [bookChoice, setBook] = useState(initialBook?.id ?? "");
  const [sectionId, setSection] = useState(initialSection?.id ?? "");
  const [subsectionId, setSubsection] = useState(
    initialSection?.subsections.find(({ id }) => id === initialTopicId)?.id ?? "");
  const heading = useRef<HTMLHeadingElement>(null);
  const savedGrade = useSelectedGrade();
  const subjectBooks = books.filter((book) => book.world === world);
  const grades = [...new Set(subjectBooks.map((book) => book.grade))].sort((a, b) => a - b);
  const grade = gradeChoice ?? (savedGrade !== null && grades.includes(savedGrade) ? savedGrade : grades[0]);
  const gradeBooks = subjectBooks.filter((book) => book.grade === grade);
  const book = gradeBooks.find(({ id }) => id === bookChoice) ?? gradeBooks[0];
  const bookSections = sections.filter(({ bookId }) => bookId === book?.id);
  const section = bookSections.find(({ id }) => id === sectionId);
  const matches = section ? getSectionWorksheets(worksheets, section.id, subsectionId) : [];

  function selectSection(id: string) {
    setSection(id);
    setSubsection("");
  }

  function selectSubject(subject: World | null) {
    setWorld(subject);
    setGrade(undefined);
    setBook("");
    selectSection("");
    heading.current?.focus();
  }

  return (
    <div className={styles.browser} data-world={world ?? undefined}>
      <h2 ref={heading} tabIndex={-1}>
        {section ? <SectionTitle {...section} /> : subjects.find(({ id }) => id === world)?.label ?? "Elige una asignatura"}
      </h2>
      {!world ? (
        <div className={styles.choices}>
          {subjects.map(({ id, label }) => (
            <button key={id} type="button" className={styles.subjectButton} data-world={id}
              onClick={() => selectSubject(id)}>{label}</button>
          ))}
        </div>
      ) : (
        <>
          <nav className={styles.choices} aria-label="Navegación de fichas">
            <button type="button" onClick={() => selectSubject(null)}>Volver a asignaturas</button>
            {section && <button type="button" onClick={() => {
              selectSection("");
              heading.current?.focus();
            }}>Volver a secciones</button>}
          </nav>
          <div className={styles.filters}>
            {grades.length > 0 && <label>Curso
              <select value={grade} onChange={(event) => {
                setGrade(Number(event.target.value));
                setBook("");
                selectSection("");
              }}>
                {grades.map((level) => <option key={level} value={level}>Primaria {level}</option>)}
              </select>
            </label>}
            {book && gradeBooks.length > 1 && <label>Libro
              <select value={book.id} onChange={(event) => {
                setBook(event.target.value);
                selectSection("");
              }}>
                {gradeBooks.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
              </select>
            </label>}
            {section && section.subsections.length > 0 && <label className={styles.topicFilter}>Tema
              <select value={subsectionId} onChange={(event) => setSubsection(event.target.value)}>
                <option value="">Toda la sección</option>
                {section.subsections.map(({ id, title, language }) => (
                  <option key={id} value={id} lang={language}>{title}</option>
                ))}
              </select>
            </label>}
          </div>
          {!section ? (
            bookSections.length ? (
              <>
                <h3>Secciones</h3>
                <ul className={styles.sections}>
                  {bookSections.map((entry) => (
                    <li key={entry.id}><button type="button" onClick={() => {
                      selectSection(entry.id);
                      heading.current?.focus();
                    }}><SectionTitle {...entry} /></button></li>
                  ))}
                </ul>
              </>
            ) : <p>Todavía no hay secciones disponibles para esta asignatura.</p>
          ) : (
            <>
              <h3>Fichas disponibles</h3>
              <div aria-live="polite">
                {matches.length ? (
                  <ul className={styles.files}>
                    {matches.map(({ path, title }) => {
                      const href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
                      const pdf = isWorksheetPdf(path);
                      return (
                        <li key={path}>
                          <h4>{title}</h4>
                          <div className={styles.choices}>
                            {pdf && <a href={href} target="_blank" rel="noopener"
                              aria-label={`Abrir e imprimir: ${title} (PDF, nueva pestaña)`}>Abrir e imprimir</a>}
                            <a href={href} download aria-label={`Descargar ${pdf ? "PDF" : "Word"}: ${title}`}>
                              Descargar {pdf ? "PDF" : "Word"}
                            </a>
                          </div>
                          {!pdf && <p>Abre el archivo descargado en Word o en un programa compatible para imprimirlo.</p>}
                        </li>
                      );
                    })}
                  </ul>
                ) : <p>Todavía no hay fichas para {subsectionId ? "este tema" : "esta sección"}. Elige otra opción para seguir buscando.</p>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

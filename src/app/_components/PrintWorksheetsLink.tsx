import Link from "next/link";
import { worksheets } from "@/features/curriculum/catalog";
import { getSectionWorksheets, isWorksheetPdf } from "@/features/curriculum/worksheet-files";
import styles from "./subsections.module.css";

export function PrintWorksheetsLink({ sectionId, subsectionId }: { sectionId: string; subsectionId: string | undefined }) {
  const [firstPdf, ...otherPdfs] = getSectionWorksheets(worksheets, sectionId, subsectionId)
    .filter(({ path }) => isWorksheetPdf(path));
  if (!firstPdf) return null;

  const label = <><span aria-hidden="true">🖨</span> Imprimir fichas</>;
  if (!otherPdfs.length) {
    const href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${firstPdf.path}`;
    return (
      <a className={styles.printWorksheets} href={href} target="_blank" rel="noopener"
        aria-label="Imprimir fichas (PDF, nueva pestaña)">{label}</a>
    );
  }

  const query = { section: sectionId, ...(subsectionId && { topic: subsectionId }) };
  return <Link className={styles.printWorksheets} href={{ pathname: "/worksheets/", query }}>{label}</Link>;
}

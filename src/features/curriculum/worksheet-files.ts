import type { Worksheet } from "./catalog";

export function isWorksheetPdf(path: string) {
  return path.toLowerCase().endsWith(".pdf");
}

export function getSectionWorksheets(worksheets: Worksheet[], sectionId: string, subsectionId?: string) {
  return worksheets.filter((sheet) =>
    sheet.sectionId === sectionId && (!subsectionId || sheet.subsectionId === subsectionId));
}

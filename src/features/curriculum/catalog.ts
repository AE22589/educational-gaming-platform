import data from "./curriculum.generated.json";

export type World = "englishworld" | "scienceworld";
export type CurriculumUnit = (typeof data.units)[number];

export const availableGrade = 2;

export const { books, units } = data;

export function getBookUnits(bookId: string) {
  return units.filter((unit) => unit.bookId === bookId);
}

const sectionTones = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"] as const;

export function getSectionTone(unit: Pick<CurriculumUnit, "id" | "bookId">) {
  const position = getBookUnits(unit.bookId).findIndex(({ id }) => id === unit.id);
  return sectionTones[position % sectionTones.length];
}

export function getBook(bookId: string) {
  const book = books.find((entry) => entry.id === bookId);
  if (!book) throw new Error(`Unknown curriculum book ${bookId}`);
  return book;
}

export const practiceIds = {
  sports: "english-2-b1-s01",
  seasons: "english-2-b1-s02",
  body: "science-2-b2-s01",
} as const;

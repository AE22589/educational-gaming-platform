import data from "./curriculum.generated.json";

export type World = "englishworld" | "scienceworld";
export type CurriculumUnit = Omit<(typeof data.units)[number], "games" | "subsections" | "number" | "spanishTitle"> & {
  games: string[];
  number?: number;
  spanishTitle?: string;
  subsections: { id: string; title: string; stableId?: string; spanishTitle?: string; image?: string; games?: string[] }[];
};

export const availableGrade = 2;

export const { books } = data;
export const units: CurriculumUnit[] = data.units;
export type Worksheet = { sectionId: string; subsectionId: string; title: string; path: string };
export const worksheets: Worksheet[] = data.worksheets;

export function getBookUnits(bookId: string) {
  return units.filter((unit) => unit.bookId === bookId);
}

const sectionTones = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"] as const;

export function getSectionTone(unit: Pick<CurriculumUnit, "id" | "bookId">) {
  const position = getBookUnits(unit.bookId).findIndex(({ id }) => id === unit.id);
  return sectionTones[position % sectionTones.length];
}

export function getBook(bookId: string): Omit<(typeof books)[number], "world"> & { world: World } {
  const book = books.find((entry) => entry.id === bookId);
  if (!book || (book.world !== "englishworld" && book.world !== "scienceworld")) {
    throw new Error(`Unknown curriculum book ${bookId}`);
  }
  return { ...book, world: book.world };
}

export const practiceIds = {
  sports: "english-2-b1-s01",
  seasons: "english-2-b1-s02",
  body: "science-2-b2-s01",
  healthyHabits: "science-2-b2-s02",
} as const;

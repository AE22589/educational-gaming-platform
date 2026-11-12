import { cache } from "react";
import { join } from "node:path";
import { readSheet } from "read-excel-file/node";
import { englishUnits } from "./units";

const readEnglishVocabulary = cache(async () => {
  const [header, ...rows] = await readSheet(join(process.cwd(), "docs", "List.xlsx"), "vocabulary_list");
  const columns = ["Class", "Unit Name", "English word", "Spanish translation"].map((name) => header?.indexOf(name) ?? -1);
  if (columns.some((index) => index < 0)) {
    throw new Error("docs/List.xlsx is missing required vocabulary columns.");
  }

  const vocabulary = new Map(englishUnits.map(({ title }) => [title, new Map<string, { word: string; translation: string }>()]));
  for (const [index, row] of rows.entries()) {
    const [subject, title, term, translation] = columns.map((column) => row[column]);
    if (subject !== "English") continue;
    if (typeof title !== "string" || typeof term !== "string" || typeof translation !== "string"
      || !term.trim() || !translation.trim()) {
      throw new Error(`Invalid English vocabulary in docs/List.xlsx at row ${index + 2}.`);
    }
    const unit = vocabulary.get(title.trim());
    if (!unit) throw new Error(`Unknown English World unit in docs/List.xlsx: ${title}.`);
    const word = term.trim().replace(/\s+/g, " ");
    const key = word.toLowerCase();
    if (unit.has(key)) throw new Error(`Duplicate vocabulary in ${title}: ${word}.`);
    unit.set(key, { word, translation: translation.trim() });
  }
  return vocabulary;
});

export async function getUnitVocabulary(title: string) {
  const vocabulary = (await readEnglishVocabulary()).get(title);
  if (!vocabulary?.size) throw new Error(`No vocabulary in docs/List.xlsx for ${title}.`);
  return Array.from(vocabulary.values());
}

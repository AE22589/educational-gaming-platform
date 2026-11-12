import { getUnitVocabulary } from "../workbook";
import { englishUnits } from "../units";
import type { VocabularyItem } from "./vocabulary";

type PracticeUnit = "sports" | "seasons";

const sportPictures: Record<string, string> = {
  hockey: "🏒", football: "⚽", basketball: "🏀", tennis: "🎾",
  "table tennis": "🏓", badminton: "🏸", baseball: "⚾", swimming: "🏊",
  cycling: "🚲", skateboarding: "🛹", bat: "bat", racket: "racket",
  helmet: "⛑️", gloves: "🧤", "knee pads": "knee", "elbow pads": "elbow",
};

const sportPhrases: Record<string, [group: string, phrase: string, sortPhrase?: string]> = {
  swimming: ["Go", "I like swimming", "go swimming"],
  cycling: ["Go", "I like cycling", "go cycling"],
  skateboarding: ["Go", "I like skateboarding", "go skateboarding"],
  bat: ["Play", "I have a bat", "play baseball with a bat"],
  racket: ["Play", "I have a racket", "play tennis with a racket"],
  helmet: ["Wear", "I wear a helmet"],
  gloves: ["Wear", "I wear gloves"],
  "knee pads": ["Wear", "I wear knee pads"],
  "elbow pads": ["Wear", "I wear elbow pads"],
};

const seasons = new Set(["spring", "summer", "autumn", "winter"]);
const seasonPictures: Record<string, string> = {
  sunny: "☀️", rainy: "🌧️", cloudy: "☁️", windy: "🌬️", stormy: "⛈️",
  snowy: "🌨️", foggy: "🌫️", icy: "🧊", wet: "💧", dry: "🏜️",
  spring: "🌷", summer: "🏖️", autumn: "🍂", winter: "⛄",
  "have a picnic": "🧺", "plant flowers": "🪴", "ride a bike": "🚴",
  "go swimming": "🏊", "fly a kite": "🪁", "read a book": "📖",
  "draw a picture": "✏️", "paint pictures": "🎨",
};

export async function getPracticeUnit(slug: PracticeUnit) {
  const unit = englishUnits.find((entry) => entry.slug === slug)!;
  const rows = await getUnitVocabulary(unit.title);
  const vocabulary = rows.map((item): VocabularyItem => {
    const word = item.word.toLowerCase();
    if (slug === "sports") {
      const [group, phrase, sortPhrase] =
        sportPhrases[word] ?? ["Play", `I play ${word}`];
      return { ...item, word, picture: sportPictures[word], group, phrase, sortPhrase: sortPhrase ?? phrase.replace(/^I /, "") };
    }

    const group = seasons.has(word) ? "Season" : word.includes(" ") ? "Activity" : "Weather";
    return {
      ...item,
      word,
      picture: seasonPictures[word],
      group,
      phrase: group === "Activity" ? `I like to ${word}` : `It is ${word}`,
    };
  });
  return { title: unit.title, vocabulary };
}

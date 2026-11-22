import type { CurriculumUnit } from "@/features/curriculum/catalog";
import type { VocabularyItem } from "./vocabulary";

import type { PracticeUnit } from "./game-menu";

const sportPictures: Record<string, string> = {
  hockey: "🏒", football: "⚽", basketball: "🏀", tennis: "🎾",
  "table tennis": "🏓", badminton: "🏸", baseball: "⚾", swimming: "🏊",
  cycling: "🚲", skateboarding: "🛹", bat: "🏏", racket: "racket",
  helmet: "⛑️", gloves: "🧤", "knee pads": "🛡️", "elbow pads": "🛡️",
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

function phraseAudioPath(phrase: string) {
  const filename = phrase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `/audio/en-gb/phrases/${filename}.mp3`;
}

export function getPictureMatchVocabulary(vocabulary: CurriculumUnit["vocabulary"]): VocabularyItem[] {
  const seen = new Set<string>();
  return vocabulary.flatMap((item) => {
    const word = item.word.toLowerCase();
    const key = JSON.stringify([word, item.image]);
    if (!item.image.startsWith("/") || seen.has(key)) return [];
    seen.add(key);
    return [{ ...item, word, picture: item.image, group: "", phrase: word }];
  });
}

export function getPracticeVocabulary(unit: CurriculumUnit, slug: PracticeUnit) {
  const seen = new Set<string>();
  return unit.vocabulary.flatMap((item): VocabularyItem[] => {
    const word = item.word.toLowerCase();
    if (seen.has(word)) return [];
    seen.add(word);
    if (slug === "healthy-habits" || slug === "vocabulary") {
      return [{ ...item, word, picture: item.image, group: "", phrase: word }];
    }
    if (slug === "sports") {
      const [group, phrase, sortPhrase] =
        sportPhrases[word] ?? ["Play", `I play ${word}`];
      return [{ ...item, word, picture: item.image || sportPictures[word], group, phrase,
        phraseAudioPath: phraseAudioPath(phrase), sortPhrase: sortPhrase ?? phrase.replace(/^I /, "") }];
    }

    const group = seasons.has(word) ? "Season" : word.includes(" ") ? "Activity" : "Weather";
    const phrase = group === "Activity" ? `I like to ${word}` : `It is ${word}`;
    return [{
      ...item,
      word,
      picture: item.image || seasonPictures[word],
      group,
      phrase,
      phraseAudioPath: phraseAudioPath(phrase),
    }];
  });
}

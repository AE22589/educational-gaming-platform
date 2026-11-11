export const sportsVocabulary = [
  { word: "hockey", translation: "hockey sobre hielo", picture: "🏒", phrase: "I play hockey" },
  { word: "football", translation: "fútbol", picture: "⚽", phrase: "I play football" },
  { word: "basketball", translation: "baloncesto", picture: "🏀", phrase: "I play basketball" },
  { word: "tennis", translation: "tenis", picture: "🎾", phrase: "I play tennis" },
  { word: "table tennis", translation: "tenis de mesa", picture: "🏓", phrase: "I play table tennis" },
  { word: "badminton", translation: "bádminton", picture: "🏸", phrase: "I play badminton" },
  { word: "baseball", translation: "béisbol", picture: "⚾", phrase: "I play baseball" },
  { word: "swimming", translation: "natación", picture: "🏊", phrase: "I like swimming" },
  { word: "cycling", translation: "ciclismo", picture: "🚴", phrase: "I like cycling" },
  { word: "skateboarding", translation: "monopatinaje", picture: "🛹", phrase: "I like skateboarding" },
  { word: "bat", translation: "bate", picture: "bat", phrase: "I have a bat" },
  { word: "racket", translation: "raqueta", picture: "racket", phrase: "I have a racket" },
  { word: "helmet", translation: "casco", picture: "⛑️", phrase: "I wear a helmet" },
  { word: "gloves", translation: "guantes", picture: "🧤", phrase: "I wear gloves" },
  { word: "knee pads", translation: "rodilleras", picture: "knee", phrase: "I wear knee pads" },
  { word: "elbow pads", translation: "coderas", picture: "elbow", phrase: "I wear elbow pads" },
];

export type VocabularyItem = (typeof sportsVocabulary)[number];

export function normalizeWord(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function scramble<T>(items: T[], seed: number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const swap = seed % (index + 1);
    [shuffled[index], shuffled[swap]] = [shuffled[swap]!, shuffled[index]!];
  }
  if (shuffled.every((item, index) => item === items[index])) {
    shuffled.push(shuffled.shift()!);
  }
  return shuffled;
}

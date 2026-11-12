export type VocabularyItem = {
  word: string;
  translation: string;
  picture: string | undefined;
  phrase: string;
  group: string;
  sortPhrase?: string;
};

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

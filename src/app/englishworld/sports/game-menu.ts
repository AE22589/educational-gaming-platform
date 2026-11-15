const games = [
  { id: "match", name: "Picture Match", description: "Une cada dibujo con su palabra.", art: "🖼️ ⚽", color: "blue" },
  { id: "mystery", name: "Mystery Word", description: "Adivina la letra que falta.", art: "🔤 ✏️", color: "green" },
  { id: "phrase", name: "Build a Phrase", description: "Ordena las palabras de la frase.", art: "💬 🧩", color: "pink" },
  { id: "spell", name: "See It, Hear It, Spell It", description: "Mira o escucha y escribe.", art: "🎧 ⌨️", color: "sky" },
  { id: "scramble", name: "Letter Scramble", description: "Pon las letras en orden.", art: "🔠 🔀", color: "lime" },
  { id: "hunt", name: "Word Hunt", description: "Encuentra palabras en la cuadrícula.", art: "🔡 🔎", color: "lavender" },
  { id: "spot", name: "Look & Find", description: "Completa la palabra y toca el objeto.", art: "✏️ 👀", color: "peach" },
  { id: "sort", name: "Play, Go, Do, Wear?", description: "Clasifica deportes y objetos.", art: "⚽ 🧢", color: "mint" },
] as const;

export type Game = Omit<(typeof games)[number], "name"> & { name: string };

export type PracticeUnit = "sports" | "seasons" | "healthy-habits";

export function gameName(game: (typeof games)[number], unit: PracticeUnit) {
  return unit === "seasons" && game.id === "sort" ? "Weather, Season or Activity?" : game.name;
}

export function getPracticeGames(availableGames: readonly string[], unit: PracticeUnit) {
  return availableGames.flatMap((name) => games.filter((entry) => {
    if (unit === "healthy-habits" && (entry.id === "spot" || entry.id === "sort")) return false;
    return gameName(entry, unit) === name;
  }));
}

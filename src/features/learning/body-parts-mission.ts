export type BodyWord = {
  id: string;
  term: string;
  meaning: string;
  round: 1 | 2;
  targets: string[];
  image: string;
};

export const BODY_PARTS_WORDS: BodyWord[] = [
  { id: "eye", term: "eye", meaning: "ojo", round: 1, targets: ["eye-left", "eye-right"], image: "👁️" },
  { id: "ear", term: "ear", meaning: "oreja", round: 1, targets: ["ear-left", "ear-right"], image: "👂" },
  { id: "nose", term: "nose", meaning: "nariz", round: 1, targets: ["nose"], image: "👃" },
  { id: "mouth", term: "mouth", meaning: "boca", round: 1, targets: ["mouth"], image: "👄" },
  { id: "head", term: "head", meaning: "cabeza", round: 2, targets: ["head"], image: "🙂" },
  { id: "arm", term: "arm", meaning: "brazo", round: 2, targets: ["arm-left", "arm-right"], image: "💪" },
  { id: "hand", term: "hand", meaning: "mano", round: 2, targets: ["hand-left", "hand-right"], image: "✋" },
  { id: "leg", term: "leg", meaning: "pierna", round: 2, targets: ["leg-left", "leg-right"], image: "🦵" },
  { id: "foot", term: "foot", meaning: "pie", round: 2, targets: ["foot-left", "foot-right"], image: "🦶" },
];

export const BODY_PARTS_TEXT = {
  eyebrow: "MISIÓN DE INGLÉS",
  title: "Misión: partes del cuerpo",
  instructions: "Arrastra cada palabra a su lugar.",
  alternative: "También puedes tocar la palabra y después su lugar.",
  retry: "Prueba otra vez.",
  hint: "Pista",
  continue: "Continuar",
  complete: "¡Misión completada! Has practicado estas palabras.",
  replay: "Jugar otra vez",
  friend: "Ir con mi amigo",
  helpLabel: "Ver ayuda",
  backToMissions: "‹ Misiones",
  cardsLabel: "Palabras para colocar",
  faceFigureAlt: "Rostro de la niña de la portada, de frente",
  bodyFigureAlt: "La niña de la portada de cuerpo entero, con los brazos extendidos a los lados",
  progressLabel: (count: number) => `Progreso de la misión: ${count} de 9`,
  start: "Comenzar",
  loading: "Preparando tu misión…",
  unavailable: "No podemos acceder a tus datos para guardar la misión.",
  readOnly: "Otra pestaña está usando tu perfil. Esta misión no puede guardar cambios aquí.",
  saveError: "No se pudo guardar la misión. Inténtalo de nuevo.",
  saveRetry: "No se pudo guardar. Inténtalo de nuevo.",
  chooseTarget: "Elige un lugar en la figura.",
  correct: "¡Muy bien!",
  demoTitle: "Así se juega",
  demoInstructions: "Elige una palabra y toca su lugar. También puedes arrastrarla.",
  skipDemo: "Saltar y empezar",
  beginAfterDemo: "Empezar",
  hintFor: (word: string) => `Pista: busca dónde va ${word}.`,
  roundLabel: (round: 1 | 2) => round === 1 ? "Ronda 1 · La cara" : "Ronda 2 · El cuerpo",
  roundOne: "¡Muy bien! Has completado la primera parte.",
  landmarks: ["Inicio", "Cueva"],
} as const;

export const roundWords = (round: 1 | 2) => BODY_PARTS_WORDS.filter((word) => word.round === round);
export const missionProgress = (placedWordIds: readonly string[]) => BODY_PARTS_WORDS.filter((word) => placedWordIds.includes(word.id)).length;
export const isRoundComplete = (round: 1 | 2, placedWordIds: readonly string[]) => roundWords(round).every((word) => placedWordIds.includes(word.id));

export function completedAdventureStations(
  progress: { runId: string; round: 1 | 2; status: "active" | "completed" } | null,
  rewards: readonly { key: string; runId: string; kind: string }[],
) {
  const previousRunRewards = rewards.filter((reward) => reward.kind === "body-round-complete" && reward.runId !== progress?.runId);
  const previousRunStations = previousRunRewards.some((reward) => reward.key.endsWith(":round-2"))
    ? 2
    : previousRunRewards.some((reward) => reward.key.endsWith(":round-1")) ? 1 : 0;
  const currentRunStations = progress?.status === "completed" ? 2 : progress?.round === 2 ? 1 : 0;
  return Math.max(previousRunStations, currentRunStations);
}

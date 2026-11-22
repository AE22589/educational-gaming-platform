import { practiceIds, type CurriculumUnit } from "@/features/curriculum/catalog";
import { getPracticeGames, pictureMatch } from "../englishworld/sports/game-menu";

export const bodyGame = "Misión: partes del cuerpo";

export function getVocabularyGames(games: string[], vocabulary: CurriculumUnit["vocabulary"]) {
  return vocabulary.some(({ image }) => image) && !games.includes(pictureMatch)
    ? [...games, pictureMatch] : games;
}

export function getUnitActivity({ id, games, vocabulary }: Pick<CurriculumUnit, "id" | "games" | "vocabulary">) {
  if (id === practiceIds.body && games.includes(bodyGame)) return "body";
  const practice = id === practiceIds.sports ? "sports" : id === practiceIds.seasons ? "seasons"
    : id.startsWith("science-") ? "healthy-habits" : "vocabulary";
  return getPracticeGames(getVocabularyGames(games, vocabulary), practice).length ? practice : null;
}

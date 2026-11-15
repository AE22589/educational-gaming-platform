import { practiceIds, type CurriculumUnit } from "@/features/curriculum/catalog";
import { getPracticeGames } from "../englishworld/sports/game-menu";

export const bodyGame = "Misión: partes del cuerpo";

export function getUnitActivity({ id, games }: Pick<CurriculumUnit, "id" | "games">) {
  if (id === practiceIds.body) return games.includes(bodyGame) ? "body" : null;
  const practice = id === practiceIds.sports ? "sports" : id === practiceIds.seasons ? "seasons"
    : id === practiceIds.healthyHabits ? "healthy-habits" : null;
  return practice && getPracticeGames(games, practice).length ? practice : null;
}

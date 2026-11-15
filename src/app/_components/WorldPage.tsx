import { availableGrade, books, getBookUnits, type World } from "@/features/curriculum/catalog";
import { WorldCatalog } from "./WorldCatalog";

export function WorldPage({ world, title }: { world: World; title: string }) {
  const book = books.find((entry) => entry.world === world && entry.grade === availableGrade);
  const worldUnits = book ? getBookUnits(book.id) : [];
  return <WorldCatalog world={world} title={title} units={worldUnits} />;
}

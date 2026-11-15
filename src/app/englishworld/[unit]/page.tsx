import { notFound } from "next/navigation";
import { units } from "@/features/curriculum/catalog";
import { legacyUnits } from "@/features/curriculum/legacy-units";
import { UnitDetail } from "../../_components/UnitDetail";

const aliases = new Map(Object.entries(legacyUnits.englishworld));

export function generateStaticParams() {
  return Array.from(aliases)
    .filter(([, id]) => units.some((unit) => unit.id === id))
    .map(([unit]) => ({ unit }));
}

export default async function Page({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = await params;
  const id = aliases.get(unit);
  if (!id) notFound();
  return <UnitDetail unitId={id} />;
}

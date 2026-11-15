import { units } from "@/features/curriculum/catalog";
import { UnitDetail } from "../../../../_components/UnitDetail";

export function generateStaticParams() {
  return units.flatMap(({ id, subsections }) =>
    subsections.map(({ id: subsectionId }) => ({ unitId: id, subsectionId })));
}

export default async function SubsectionPage({
  params,
}: {
  params: Promise<{ unitId: string; subsectionId: string }>;
}) {
  return <UnitDetail {...await params} />;
}

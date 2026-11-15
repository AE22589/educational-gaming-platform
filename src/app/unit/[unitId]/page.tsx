import { units } from "@/features/curriculum/catalog";
import { UnitDetail } from "../../_components/UnitDetail";

export function generateStaticParams() {
  return units.map(({ id }) => ({ unitId: id }));
}

export default async function UnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <UnitDetail unitId={unitId} />;
}

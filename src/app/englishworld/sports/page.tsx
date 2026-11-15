import { practiceIds } from "@/features/curriculum/catalog";
import { UnitDetail } from "../../_components/UnitDetail";

export default function Page() {
  return <UnitDetail unitId={practiceIds.sports} />;
}

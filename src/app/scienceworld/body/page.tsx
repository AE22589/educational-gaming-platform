import { BodyPartsMission } from "@/features/learning/ui/BodyPartsMission";
import { practiceIds } from "@/features/curriculum/catalog";
import { PrintWorksheetsLink } from "../../_components/PrintWorksheetsLink";

export default function ScienceBodyPage() {
  return <BodyPartsMission worksheetLink={<PrintWorksheetsLink sectionId={practiceIds.body} subsectionId={undefined} />} />;
}

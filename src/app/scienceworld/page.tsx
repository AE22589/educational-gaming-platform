import { WorldCatalog } from "../_components/WorldCatalog";
import { scienceUnits } from "./units";

export default function ScienceWorldPage() {
  return (
    <WorldCatalog
      world="scienceworld"
      title="Science World"
      description="Explora seis unidades y descubre cómo funciona el mundo."
      units={scienceUnits}
    />
  );
}

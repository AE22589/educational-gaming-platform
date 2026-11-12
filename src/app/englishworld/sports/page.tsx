import type { Metadata } from "next";
import { UnitPage } from "./UnitPage";
import { getPracticeUnit } from "./unit-content";

export const metadata: Metadata = {
  title: "Let's Play Sports! · CHISPITAS",
  description: "Practica vocabulario de deportes en inglés con ocho juegos.",
};

export default async function SportsPage() {
  const { title, vocabulary } = await getPracticeUnit("sports");
  return <UnitPage title={title} vocabulary={vocabulary} unit="sports" />;
}

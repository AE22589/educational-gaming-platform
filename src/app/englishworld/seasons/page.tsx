import type { Metadata } from "next";
import { UnitPage } from "../sports/UnitPage";
import { getPracticeUnit } from "../sports/unit-content";

export const metadata: Metadata = {
  title: "Discover the Seasons! · CHISPITAS",
  description: "Practica vocabulario de las estaciones y el tiempo en inglés con ocho juegos.",
};

export default async function SeasonsPage() {
  const { title, vocabulary } = await getPracticeUnit("seasons");
  return <UnitPage title={title} vocabulary={vocabulary} unit="seasons" />;
}

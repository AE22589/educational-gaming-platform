import type { Metadata } from "next";
import { AdventureMap } from "./AdventureMap";

export const metadata: Metadata = { title: "Mapa de aventuras · CHISPITAS" };

export default function AdventureMapPage() {
  return <AdventureMap />;
}

import { Placeholder } from "@/components/ui/Placeholder";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ missionId: "animals-01" }];
}

export default async function Mission({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  if (missionId !== "animals-01") notFound();
  return (
    <Placeholder title="Tu próxima aventura">
      Estamos preparando una misión para escuchar y reconocer animales. Esta
      vista previa no inicia ninguna partida.
    </Placeholder>
  );
}

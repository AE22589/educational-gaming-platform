import { Placeholder } from "@/components/ui/Placeholder";
import { BodyPartsMission } from "@/features/learning/ui/BodyPartsMission";

export function generateStaticParams() {
  return [{ missionId: "animals-01" }, { missionId: "body-parts-01" }];
}

export default async function Mission({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  if (missionId === "body-parts-01") return <BodyPartsMission />;
  return (
    <Placeholder title="Tu próxima aventura">
      Estamos preparando una misión para escuchar y reconocer animales. Esta
      vista previa no inicia ninguna partida.
    </Placeholder>
  );
}

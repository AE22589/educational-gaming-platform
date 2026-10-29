import { Placeholder } from "@/components/ui/Placeholder";

export function generateStaticParams() {
  return [{ missionId: "animals-01" }];
}

export default function Mission() {
  return (
    <Placeholder title="Tu próxima aventura">
      Estamos preparando una misión para escuchar y reconocer animales. Esta
      vista previa no inicia ninguna partida.
    </Placeholder>
  );
}

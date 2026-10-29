import Link from "next/link";
import { Placeholder } from "@/components/ui/Placeholder";
export default function Learn() {
  return (
    <Placeholder title="Misiones para descubrir">
      La primera misión de animales está en preparación.{" "}
      <Link className="underline font-bold" href="/learn/animals-01">
        Ver la vista previa de la misión
      </Link>
    </Placeholder>
  );
}

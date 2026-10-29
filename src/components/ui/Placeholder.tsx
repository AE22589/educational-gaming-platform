import Link from "next/link";
import { Card } from "@/components/ui/Card";
export function Placeholder({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <p className="eyebrow">Vista de desarrollo</p>
      <h1>{title}</h1>
      <Card title="Estamos preparando este espacio">
        <p>{children}</p>
        <p className="mt-4">
          Todavía no se guardan datos ni se ganan estrellas.
        </p>
      </Card>
      <Link className="action inline-flex" href="/">
        Volver al inicio
      </Link>
    </div>
  );
}

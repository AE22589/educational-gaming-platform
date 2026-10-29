import Link from "next/link";
export default function NotFound() {
  return (
    <div className="space-y-6">
      <h1>No encontramos esta página</h1>
      <p>Podemos volver al inicio y seguir explorando.</p>
      <Link href="/" className="action">
        Volver al inicio
      </Link>
    </div>
  );
}

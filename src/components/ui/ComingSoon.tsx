import Image from "next/image";
import Link from "next/link";

/** Friendly placeholder page for a section that is not built yet. */
export function ComingSoon({
  title,
  image,
  children,
}: {
  title: string;
  /** Full URL of a decorative illustration (includes the deployment base path). */
  image: string;
  children: React.ReactNode;
}) {
  return (
    <section className="coming-soon" aria-labelledby="coming-soon-title">
      <p className="chispitas-eyebrow">¡Muy pronto!</p>
      <h1 id="coming-soon-title">{title}</h1>
      <div className="coming-soon-card">
        <Image src={image} alt="" width={170} height={170} unoptimized />
        <div className="coming-soon-copy">
          <h2>Estamos preparando este rincón para ti</h2>
          {children}
        </div>
      </div>
      <Link className="action" href="/">
        Volver al inicio
      </Link>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ProfileSummary } from "@/features/profile/ui/ProfileSummary";

type TileTone = "lime" | "lilac" | "orange" | "cyan";

type WorldTileProps = {
  title: string;
  description: string;
  image: string;
  tone: TileTone;
  href?: string;
  action?: string;
  comingSoon?: boolean;
};

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function WorldTile({
  title,
  description,
  image,
  tone,
  href,
  action,
  comingSoon,
}: WorldTileProps) {
  const content = (
    <>
      <span className="home-tile-art">
        <Image src={image} alt="" fill sizes="(max-width: 640px) 70vw, (max-width: 1000px) 40vw, 22vw" unoptimized />
      </span>
      <span className="home-tile-copy">
        <span className="home-tile-title">{title}</span>
        <span className="home-tile-description">{description}</span>
        {comingSoon ? (
          <span className="home-tile-button is-muted">Próximamente</span>
        ) : (
          <span className="home-tile-button"><span>{action}</span><Arrow /></span>
        )}
      </span>
    </>
  );

  const className = `home-tile tone-${tone}${comingSoon ? " is-coming-soon" : ""}`;
  return href && !comingSoon ? (
    <Link className={className} href={href} aria-label={`${title}: ${action}`}>
      {content}
    </Link>
  ) : (
    <article className={className} aria-label={`${title}, próximamente`}>
      {content}
    </article>
  );
}

export function HomepageContent() {
  const basePath = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";
  const pageStyle = {
    "--home-background": `url("${basePath}/homepage/enchanted-valley-panorama-v2.webp")`,
    "--home-mobile-background": `url("${basePath}/homepage/enchanted-valley-mobile.webp")`,
  } as CSSProperties;

  return (
    <div className="chispitas-home" style={pageStyle}>
      <section aria-labelledby="welcome-title" className="chispitas-hero">
        <div className="chispitas-hero-copy">
          <p className="chispitas-eyebrow">Una pequeña chispa te espera</p>
          <h1 id="welcome-title">¡Hola, explorador!</h1>
          <p className="chispitas-hero-subtitle">¿Preparado para la aventura de hoy?</p>
          <ProfileSummary />
        </div>
      </section>

      <section aria-label="Mundos para explorar" className="home-world-grid">
        <WorldTile
          title="Mundo de ciencias"
          description="Descubre la naturaleza y sus maravillas."
          image="/homepage/science-garden.webp"
          tone="lime"
          comingSoon
        />
        <WorldTile
          title="Mundo del inglés"
          description="Practica palabras nuevas mientras juegas."
          image="/homepage/english-book.webp"
          tone="lilac"
          href="/learn"
          action="Explorar"
        />
        <WorldTile
          title="Mi avatar"
          description="Prepara tu personaje para la aventura."
          image="/homepage/avatar-girl.webp"
          tone="orange"
          href="/avatar"
          action="Ver avatar"
        />
        <WorldTile
          title="Mapa de aventuras"
          description="Elige un camino y descubre nuevos lugares."
          image="/homepage/adventure-map.webp"
          tone="cyan"
          comingSoon
        />
      </section>

      <section aria-label="Tu aventura" className="home-support-grid">
        <article className="home-support-card support-missions">
          <div className="home-support-copy">
            <p className="home-support-kicker">Pequeños pasos</p>
            <h2>Tu próxima misión</h2>
            <p>La primera aventura de animales está en preparación.</p>
            <Link href="/learn" className="home-text-link">Explorar misiones <Arrow /></Link>
          </div>
          <Image src="/homepage/daily-missions.webp" alt="" width={152} height={152} unoptimized />
        </article>

        <article className="home-support-card support-stars">
          <div className="home-support-copy">
            <p className="home-support-kicker">Sigue brillando</p>
            <h2>Tu colección de estrellas</h2>
            <p>Más adelante podrás canjearlas por sorpresas.</p>
            <Link href="/shop" className="home-text-link">Visitar tienda <Arrow /></Link>
          </div>
          <Image src="/homepage/star-chest.webp" alt="" width={164} height={142} unoptimized />
        </article>

        <article className="home-support-card support-encourage">
          <div className="home-support-copy">
            <p className="home-support-kicker">A tu ritmo, paso a paso</p>
            <h2>¡Sigue explorando!</h2>
            <p>Cada pequeño descubrimiento cuenta.</p>
          </div>
          <Image src="/homepage/turtle-companion.webp" alt="" width={146} height={146} unoptimized />
        </article>
      </section>
    </div>
  );
}

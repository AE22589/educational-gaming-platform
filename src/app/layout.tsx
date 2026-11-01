import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { ProfileProvider } from "@/features/profile/ui/ProfileProvider";

export const metadata: Metadata = {
  title: "CHISPITAS · Aprende y explora",
  description: "Una plataforma alegre para descubrir, aprender y jugar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <ProfileProvider>
          <a className="skip-link" href="#main">Saltar al contenido</a>
          <header className="chispitas-header">
            <div className="chispitas-header-inner">
              <Link href="/" className="chispitas-brand">
                <Image className="chispitas-mark" src="/homepage/nav-shop.webp" alt="" width={96} height={96} priority unoptimized />
                <span className="chispitas-brand-copy">
                  <span className="chispitas-wordmark">CHISPITAS</span>
                  <span className="chispitas-tagline">PEQUEÑAS CHISPAS, GRANDES DESCUBRIMIENTOS</span>
                </span>
              </Link>
              <nav aria-label="Navegación principal" className="chispitas-nav">
                <Link href="/#profile-summary" className="chispitas-nav-item">
                  <Image className="chispitas-nav-art" src="/homepage/nav-profile.webp" alt="" width={64} height={64} unoptimized /><span>Mi perfil</span>
                </Link>
                <span className="chispitas-nav-item is-soon" aria-disabled="true">
                  <Image className="chispitas-nav-art" src="/homepage/nav-science.webp" alt="" width={64} height={64} unoptimized /><span>Ciencias<small>Próximamente</small></span>
                </span>
                <Link href="/learn" className="chispitas-nav-item">
                  <Image className="chispitas-nav-art" src="/homepage/nav-learn.webp" alt="" width={64} height={64} unoptimized /><span>Aprender<small>Inglés</small></span>
                </Link>
                <Link href="/shop" className="chispitas-nav-item">
                  <Image className="chispitas-nav-art" src="/homepage/nav-shop.webp" alt="" width={64} height={64} unoptimized /><span>Tienda de estrellas</span>
                </Link>
                <span className="chispitas-nav-item is-soon" aria-disabled="true">
                  <Image className="chispitas-nav-art" src="/homepage/nav-map.webp" alt="" width={64} height={64} unoptimized /><span>Mapa de aventuras<small>Próximamente</small></span>
                </span>
              </nav>
            </div>
          </header>
          <main id="main" tabIndex={-1} className="chispitas-main">
            {children}
          </main>
          <footer className="chispitas-footer">
            Un pequeño paso, una gran aventura.
          </footer>
        </ProfileProvider>
      </body>
    </html>
  );
}

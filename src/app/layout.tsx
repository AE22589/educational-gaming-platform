import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import "./globals.css";
import { ProfileProvider } from "@/features/profile/ui/ProfileProvider";
import { PrimaryNavigation } from "./PrimaryNavigation";

export const metadata: Metadata = {
  title: "CHISPITAS · Aprende y explora",
  description: "Una plataforma alegre para descubrir, aprender y jugar.",
};

const assetBasePath = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body style={{ "--home-background": `url("${assetBasePath}/homepage/enchanted-valley-tall.webp")` } as CSSProperties}>
        <ProfileProvider>
          <a className="skip-link" href="#main">Saltar al contenido</a>
          <header className="chispitas-header">
            <div className="chispitas-header-inner">
              <Link href="/" className="chispitas-brand">
                <Image className="chispitas-mark" src={`${assetBasePath}/homepage/nav-shop.webp`} alt="" width={96} height={96} priority unoptimized />
                <span className="chispitas-brand-copy">
                  <span className="chispitas-wordmark">CHISPITAS</span>
                  <span className="chispitas-tagline">PEQUEÑAS CHISPAS, GRANDES DESCUBRIMIENTOS</span>
                </span>
              </Link>
              <PrimaryNavigation assetBasePath={assetBasePath} />
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

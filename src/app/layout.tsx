import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ProfileProvider } from "@/features/profile/ui/ProfileProvider";
export const metadata: Metadata = {
  title: "Aventura Animal · Aprende y explora",
  description: "Un espacio para aprender, paso a paso. Versión de desarrollo.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <ProfileProvider>
          <a className="skip-link" href="#main">
            Saltar al contenido
          </a>
          <header className="border-b border-teal-900/10 bg-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
              <Link href="/" className="brand">
                Aventura Animal
              </Link>
              <nav
                aria-label="Navegación principal"
                className="flex flex-wrap gap-1"
              >
                <Link href="/learn">Aprender</Link>
                <Link href="/shop">Tienda</Link>
                <Link href="/avatar">Mi avatar</Link>
              </nav>
            </div>
          </header>
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto max-w-6xl px-5 py-10 sm:py-16"
          >
            {children}
          </main>
          <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-stone-600">
            Versión de desarrollo · A tu ritmo, paso a paso.
          </footer>
        </ProfileProvider>
      </body>
    </html>
  );
}

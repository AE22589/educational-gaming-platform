import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { homepageSampleData } from "@/features/homepage/data";
import { HomepageHeaderNavigation } from "@/features/homepage/ui/HomepageNavigation";
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
              <Link className="brand min-w-0 flex-[1_1_27rem] gap-3 text-slate-800 no-underline" href="/" aria-label="CHISPITAS home" prefetch={false}>
                <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-400 text-3xl text-white drop-shadow-md">★</span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <strong className="text-2xl font-black tracking-wide text-indigo-950 sm:text-3xl">CHISPITAS</strong>
                  <small className="text-xs font-semibold text-slate-700">Learning Platform for Bilingual Schools</small>
                  <small className="mt-0.5 text-xs font-semibold leading-snug text-slate-700"><span lang="es">Pequeñas chispas, grandes descubrimientos.</span> <span lang="en">Little sparks. Big discoveries.</span></small>
                </span>
              </Link>
              <HomepageHeaderNavigation items={homepageSampleData.navigation} />
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

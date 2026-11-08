"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function PrimaryNavigation({ assetBasePath }: { assetBasePath: string }) {
  const pathname = usePathname();
  const pathWithoutBase = assetBasePath && pathname?.startsWith(assetBasePath)
    ? pathname.slice(assetBasePath.length) || "/"
    : pathname;
  const isHome = pathWithoutBase === "/";

  return (
    <nav
      aria-label="Navegación principal"
      className="chispitas-nav"
      data-home={isHome}
    >
      {!isHome && (
        <Link href="/" className="chispitas-nav-item chispitas-nav-item--home">
          <Image
            className="chispitas-nav-art"
            src={`${assetBasePath}/homepage/nav-home.webp`}
            alt=""
            width={64}
            height={64}
            unoptimized
          />
          <span>Home</span>
        </Link>
      )}
      <Link href="/about" className="chispitas-nav-item chispitas-nav-item--about">
        <Image
          className="chispitas-nav-art"
          src={`${assetBasePath}/homepage/nav-shop.webp`}
          alt=""
          width={64}
          height={64}
          unoptimized
        />
        <span>About Chispitas<small>Sobre Chispitas · ¡Muy pronto!</small></span>
      </Link>
      <Link href="/contact" className="chispitas-nav-item chispitas-nav-item--contact">
        <Image
          className="chispitas-nav-art"
          src={`${assetBasePath}/homepage/contact-dragon.webp`}
          alt=""
          width={64}
          height={64}
          unoptimized
        />
        <span>Contact Us<small>Contacto · ¡Muy pronto!</small></span>
      </Link>
      <Link href="/login-register" className="chispitas-nav-item chispitas-nav-item--login">
        <Image
          className="chispitas-nav-art"
          src={`${assetBasePath}/homepage/nav-profile.webp`}
          alt=""
          width={64}
          height={64}
          unoptimized
        />
        <span>Log in/Register<small>Iniciar sesión/Registrarse</small></span>
      </Link>
    </nav>
  );
}

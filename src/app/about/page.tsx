import { ComingSoon } from "@/components/ui/ComingSoon";

export default function About() {
  const basePath =
    process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

  return (
    <ComingSoon title="Sobre Chispitas" image={`${basePath}/homepage/nav-shop.webp`}>
      <p>
        Pequeñas chispas, grandes descubrimientos. Muy pronto te contaremos
        aquí quiénes somos y qué estamos preparando para ti.
      </p>
      <p>Mientras tanto, sigue explorando: ¡hay mucho por descubrir!</p>
    </ComingSoon>
  );
}

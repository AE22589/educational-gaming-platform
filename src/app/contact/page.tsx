import { ComingSoon } from "@/components/ui/ComingSoon";

export default function Contact() {
  const basePath =
    process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

  return (
    <ComingSoon title="Contacto" image={`${basePath}/homepage/contact-dragon.webp`}>
      <p>
        ¡Estamos preparando un buzón mágico para recibir tus mensajes! Muy
        pronto podrás escribirnos desde aquí.
      </p>
      <p>Mientras tanto, sigue explorando: ¡hay mucho por descubrir!</p>
    </ComingSoon>
  );
}

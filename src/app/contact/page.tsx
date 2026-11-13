import Image from "next/image";

import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

export default function Contact() {
  return (
    <section className={styles.card} aria-labelledby="contact-title">
      <header className={styles.intro}>
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/homepage/contact-dragon-envelope.webp`} alt="" width={136} height={136} unoptimized />
        <div>
          <h1 id="contact-title">¡Cuéntanos!</h1>
          <p>¿Tienes alguna pregunta, una idea para un juego o algo que te gustaría mejorar? Puedes escribirnos para pedir ayuda, compartir una sugerencia o simplemente saludar.</p>
        </div>
      </header>
      <ContactForm />
    </section>
  );
}

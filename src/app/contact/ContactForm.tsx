"use client";

import { useRef, useState, type FormEvent } from "react";

import styles from "./contact.module.css";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
const endpoint = formId && /^[a-z0-9]+$/i.test(formId)
  ? `https://formspree.io/f/${formId}`
  : undefined;

const feedback = {
  email: "Escribe un correo electrónico válido.",
  message: "Escribe un mensaje.",
  sending: "Enviando…",
  success: "¡Gracias! Hemos recibido tu mensaje",
  error: "No hemos podido enviar tu mensaje. Inténtalo de nuevo",
  unavailable: "El formulario todavía no está disponible.",
} as const;

export function ContactForm() {
  const pending = useRef(false);
  const [status, setStatus] = useState<keyof typeof feedback | "idle">(endpoint ? "idle" : "unavailable");
  const sending = status === "sending";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;

    const form = event.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const message = form.elements.namedItem("message") as HTMLTextAreaElement;

    if (!email.validity.valid) {
      setStatus("email");
      email.focus();
      return;
    }
    if (!message.value.trim()) {
      setStatus("message");
      message.focus();
      return;
    }
    if (!endpoint) {
      setStatus("unavailable");
      return;
    }

    const data = new FormData(form);
    data.set("message", message.value.trim());
    pending.current = true;
    setStatus("sending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      pending.current = false;
    }
  }

  return (
    <form className={styles.form} method="post" action={endpoint} onSubmit={submit} noValidate>
      <div className={styles.field}>
        <label htmlFor="contact-email">Tu correo electrónico</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required readOnly={sending}
          aria-invalid={status === "email"}
          aria-describedby={status === "email" ? "contact-email-hint contact-feedback" : "contact-email-hint"}
          onChange={() => { if (status === "email") setStatus("idle"); }}
        />
        <p id="contact-email-hint" className={styles.hint}>
          Si eres menor, pide a un adulto que te ayude a enviarnos el mensaje
        </p>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Tu mensaje</label>
        <textarea id="contact-message" name="message" rows={5} required readOnly={sending}
          aria-invalid={status === "message"}
          aria-describedby={status === "message" ? "contact-feedback" : undefined}
          onChange={() => { if (status === "message") setStatus("idle"); }}
        />
      </div>
      <input name="_gotcha" type="text" hidden tabIndex={-1} autoComplete="off" />
      <button className={styles.submit} type="submit" disabled={sending}>
        {sending ? "Enviando…" : "Enviar mensaje"}
      </button>
      <div id="contact-feedback" role="status" className={styles.feedback} data-status={status}>
        {status !== "idle" && feedback[status]}
      </div>
    </form>
  );
}

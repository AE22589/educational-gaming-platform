"use client";

import { useState, type FormEvent } from "react";

type FormMode = "sign-in" | "register";

const grades = [
  "1.º de Primaria",
  "2.º de Primaria",
  "3.º de Primaria",
  "4.º de Primaria",
  "5.º de Primaria",
  "6.º de Primaria",
];

export default function LoginRegisterPage() {
  const [mode, setMode] = useState<FormMode>("sign-in");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");

  function switchMode(nextMode: FormMode) {
    setMode(nextMode);
    setEmailError("");
    setMessage("");
  }

  function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const validEmail = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim());
    if (!validEmail) {
      setEmailError("Please enter a valid email address, like name@example.com.");
      setMessage("");
      return;
    }
    if (!String(formData.get("username") ?? "").trim()) {
      setMessage("Please enter a user name.");
      return;
    }
    setEmailError("");
    setMessage("Account creation is not connected yet.");
  }

  function submitSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Sign in is not connected yet.");
  }

  return (
    <div className="shop-scene auth-scene">
      <header className="auth-heading" aria-labelledby="auth-title">
        <h1 id="auth-title">Login or Register</h1>
        <p>Iniciar sesión o registrarse</p>
      </header>

      <section className="shop-window auth-window" aria-label="Login or register form">

        <div className="shop-filters auth-switcher" aria-label="Choose a form">
          <button type="button" className={`shop-filter ${mode === "sign-in" ? "is-selected" : ""}`} aria-pressed={mode === "sign-in"} onClick={() => switchMode("sign-in")}>Sign In / Iniciar sesión</button>
          <button type="button" className={`shop-filter ${mode === "register" ? "is-selected" : ""}`} aria-pressed={mode === "register"} onClick={() => switchMode("register")}>Register / Registrarse</button>
        </div>

        {mode === "sign-in" ? (
          <form className="auth-form" onSubmit={submitSignIn} aria-label="Sign In / Iniciar sesión">
            <label className="auth-field">Email / Correo<input autoComplete="email" name="sign-in-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="auth-field">Password / Contraseña<input autoComplete="current-password" name="password" type="password" required /></label>
            <button className="shop-buy-button auth-submit" type="submit">Log In / Iniciar sesión</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitRegister} aria-label="Register / Registrarse" noValidate>
            <label className="auth-field">Email / Correo<input autoComplete="email" name="register-email" type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setEmailError(""); }} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "register-email-error" : undefined} /></label>
            {emailError && <p className="auth-error" id="register-email-error" role="alert">{emailError}</p>}
            <label className="auth-field">User Name / Nombre de usuario<input autoComplete="username" name="username" type="text" required /></label>
            <label className="auth-field">Grade / Curso<select name="grade" defaultValue={grades[0]}>{grades.map((grade) => <option key={grade}>{grade}</option>)}</select></label>
            <label className="auth-field">School Name / Nombre de la escuela<select name="school" defaultValue="AE School"><option>AE School</option></select></label>
            <button className="shop-buy-button auth-submit" type="submit">Create Account / Crear cuenta</button>
          </form>
        )}
        <p className="auth-feedback" aria-live="polite">{message}</p>
      </section>
    </div>
  );
}

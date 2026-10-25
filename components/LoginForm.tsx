"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "error">("idle");
  const [googleBusy, setGoogleBusy] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const destino = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function conGoogle() {
    setGoogleBusy(true);
    setMensaje("");
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: destino() },
    });
    // Si todo sale bien, el navegador se va a Google y no vuelve a este punto.
    if (error) {
      setGoogleBusy(false);
      setEstado("error");
      setMensaje(error.message);
    }
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setEstado("enviando");
    setMensaje("");
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: destino(),
        data: nombre.trim() ? { nombre: nombre.trim() } : undefined,
      },
    });
    if (error) {
      setEstado("error");
      setMensaje(error.message);
    } else {
      setEstado("enviado");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="ficha" role="status">
        <h2>Revisa tu correo</h2>
        <p>
          Te enviamos un enlace a <strong>{email}</strong>. Ábrelo en este mismo navegador para entrar. Si no llega en
          un minuto, mira la carpeta de spam.
        </p>
      </div>
    );
  }

  return (
    <div className="login-opciones">
      <button type="button" className="btn btn-google" onClick={conGoogle} disabled={googleBusy || estado === "enviando"}>
        {googleBusy ? "Abriendo Google…" : "Continuar con Google"}
      </button>

      <p className="divisor"><span>o con tu correo</span></p>

      <form className="form login-form" onSubmit={enviar}>
        <label>
          Correo
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.cl" autoComplete="email" />
        </label>
        <label>
          Tu nombre (solo si es tu primera vez)
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Cómo quieres que te vean" autoComplete="name" />
        </label>
        <button type="submit" className="btn btn-fill" disabled={estado === "enviando" || googleBusy || !email.trim()}>
          {estado === "enviando" ? "Enviando…" : "Enviarme el enlace de acceso"}
        </button>
      </form>

      {estado === "error" && <p className="msg-error" role="alert">No pudimos ingresar: {mensaje}</p>}
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FormSolicitud({ userId }: { userId: string }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await createClient().from("solicitudes_emprendedor").insert({
      usuario_id: userId,
      nombre_emprendimiento: nombre.trim(),
      telefono: telefono.trim() || null,
      mensaje: mensaje.trim() || null,
    });
    setBusy(false);
    if (error) setError("No pudimos enviar tu solicitud: " + error.message);
    else router.refresh();
  }

  return (
    <form className="form" onSubmit={enviar}>
      <label>
        Nombre de tu emprendimiento o agrupación
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Cabalgatas Don Lalo" />
      </label>
      <label>
        Teléfono o WhatsApp de contacto
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: +56 9 1234 5678" />
      </label>
      <label>
        ¿Qué experiencia ofreces?
        <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4} placeholder="Cuéntanos en pocas líneas qué haces y dónde." />
      </label>
      <button type="submit" className="btn btn-fill" disabled={busy || !nombre.trim()}>
        {busy ? "Enviando…" : "Enviar solicitud"}
      </button>
      {error && <p className="msg-error" role="alert">{error}</p>}
    </form>
  );
}

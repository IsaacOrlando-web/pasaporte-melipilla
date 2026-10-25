"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AccionSolicitud({ usuarioId }: { usuarioId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function resolver(aprobar: boolean) {
    setBusy(true);
    setError("");
    const { error } = await createClient().rpc("resolver_solicitud", { p_usuario: usuarioId, p_aprobar: aprobar });
    setBusy(false);
    if (error) setError(error.message);
    else router.refresh();
  }

  return (
    <div>
      <div className="acciones">
        <button className="btn btn-fill" disabled={busy} onClick={() => resolver(true)}>Aprobar como emprendedor</button>
        <button className="btn" disabled={busy} onClick={() => resolver(false)}>Rechazar</button>
      </div>
      {error && <p className="msg-error" role="alert">{error}</p>}
    </div>
  );
}

export function AccionExperiencia({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  async function cambiar(aprobar: boolean) {
    if (!aprobar && motivo.trim().length < 5) {
      setError("Escribe el motivo para que el emprendedor sepa qué corregir.");
      return;
    }
    setBusy(true);
    setError("");
    const { data, error } = await createClient()
      .from("experiencias")
      .update(aprobar ? { estado: "aprobada", motivo_rechazo: null } : { estado: "rechazada", motivo_rechazo: motivo.trim() })
      .eq("id", id)
      .select("id");
    setBusy(false);
    if (error || !data || data.length === 0) setError(error?.message ?? "No se pudo actualizar.");
    else router.refresh();
  }

  return (
    <div className="revision">
      <label>
        Motivo (solo si pides cambios)
        <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: falta una foto del lugar" />
      </label>
      <div className="acciones">
        <button className="btn btn-fill" disabled={busy} onClick={() => cambiar(true)}>Aprobar y publicar</button>
        <button className="btn" disabled={busy} onClick={() => cambiar(false)}>Pedir cambios</button>
      </div>
      {error && <p className="msg-error" role="alert">{error}</p>}
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sello from "./Sello";

type Mio = { texto: string; calificacion: number | null } | null;

/** Sello del pasaporte en la página de la experiencia */
export function PanelSello(props: {
  experienciaId: string;
  slug: string;
  corto: string;
  color: string;
  userId: string | null;
  fechaSello?: string;
  publicada: boolean;
}) {
  const router = useRouter();
  const [nuevo, setNuevo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sellar() {
    if (!props.userId) return;
    setBusy(true);
    setError("");
    const { error } = await createClient()
      .from("sellos")
      .insert({ viajero_id: props.userId, experiencia_id: props.experienciaId });
    setBusy(false);
    if (error && error.code !== "23505") {
      setError("No pudimos registrar tu sello: " + error.message);
      return;
    }
    setNuevo(true);
    router.refresh();
  }

  return (
    <aside className="sello-panel" aria-live="polite">
      <Sello e={{ id: props.experienciaId, corto: props.corto, color: props.color }} fecha={props.fechaSello} size={190} nuevo={nuevo} />
      {props.fechaSello ? (
        <p><strong>Sello conseguido.</strong> Ya está en tu pasaporte.</p>
      ) : !props.publicada ? (
        <p>Los sellos se habilitan cuando la experiencia esté publicada.</p>
      ) : props.userId ? (
        <>
          <p>¿Estás en la experiencia? Registra tu visita para sumar el sello.</p>
          <button className="btn btn-fill" onClick={sellar} disabled={busy}>
            {busy ? "Sellando…" : "Sellar mi pasaporte"}
          </button>
        </>
      ) : (
        <>
          <p>Ingresa con tu correo para guardar tu sello y poder comentar.</p>
          <Link className="btn btn-fill" href={`/login?next=${encodeURIComponent(`/experiencia/${props.slug}`)}`}>
            Ingresar
          </Link>
        </>
      )}
      {error && <p className="msg-error" role="alert">{error}</p>}
    </aside>
  );
}

/** Formulario de comentario: solo para quien tiene el sello */
export function FormComentario(props: { experienciaId: string; userId: string | null; tieneSello: boolean; mio: Mio }) {
  const router = useRouter();
  const [texto, setTexto] = useState(props.mio?.texto ?? "");
  const [calificacion, setCalificacion] = useState<number>(props.mio?.calificacion ?? 5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!props.userId) return null;
  if (!props.tieneSello) {
    return <p className="nota">Para comentar, primero sella tu pasaporte en esta experiencia.</p>;
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await createClient()
      .from("comentarios")
      .upsert(
        { experiencia_id: props.experienciaId, autor_id: props.userId, calificacion, texto: texto.trim() },
        { onConflict: "experiencia_id,autor_id" }
      );
    setBusy(false);
    if (error) setError("No pudimos guardar tu comentario: " + error.message);
    else router.refresh();
  }

  async function borrar() {
    setBusy(true);
    const { error } = await createClient()
      .from("comentarios")
      .delete()
      .eq("experiencia_id", props.experienciaId)
      .eq("autor_id", props.userId!);
    setBusy(false);
    if (error) setError(error.message);
    else {
      setTexto("");
      router.refresh();
    }
  }

  return (
    <form className="form" onSubmit={guardar}>
      <h3>{props.mio ? "Tu comentario" : "Cuéntanos cómo te fue"}</h3>
      <label>
        Calificación
        <select value={calificacion} onChange={(e) => setCalificacion(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "estrella" : "estrellas"}</option>
          ))}
        </select>
      </label>
      <label>
        Tu experiencia
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} minLength={3} maxLength={1000} required placeholder="¿Qué fue lo que más te gustó?" />
      </label>
      <div className="acciones">
        <button type="submit" className="btn btn-fill" disabled={busy || texto.trim().length < 3}>
          {props.mio ? "Actualizar comentario" : "Publicar comentario"}
        </button>
        {props.mio && (
          <button type="button" className="btn" onClick={borrar} disabled={busy}>Borrar</button>
        )}
      </div>
      {error && <p className="msg-error" role="alert">{error}</p>}
    </form>
  );
}

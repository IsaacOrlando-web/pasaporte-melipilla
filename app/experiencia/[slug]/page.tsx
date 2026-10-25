import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPerfil } from "@/lib/auth";
import { DIAS, ESTADOS, SELECT_EXP, clp, hora, imagenesOrdenadas, urlImagen, type Experiencia } from "@/lib/tipos";
import { FormComentario, PanelSello } from "@/components/AccionesViajero";
import EscucharHistoria from "@/components/EscucharHistoria";

type Comentario = {
  id: string;
  texto: string;
  calificacion: number | null;
  creado_en: string;
  autor_id: string;
  autor: { nombre: string | null } | null;
};

const estrellas = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default async function PaginaExperiencia({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("experiencias").select(SELECT_EXP).eq("slug", params.slug).maybeSingle();
  if (!data) notFound();
  const e = data as unknown as Experiencia;

  const perfil = await getPerfil();
  let fechaSello: string | undefined;
  if (perfil) {
    const { data: s } = await supabase
      .from("sellos")
      .select("creado_en")
      .eq("experiencia_id", e.id)
      .eq("viajero_id", perfil.id)
      .maybeSingle();
    fechaSello = s?.creado_en;
  }

  const { data: coms } = await supabase
    .from("comentarios")
    .select("id, texto, calificacion, creado_en, autor_id, autor:perfiles(nombre)")
    .eq("experiencia_id", e.id)
    .order("creado_en", { ascending: false });
  const comentarios = (coms ?? []) as unknown as Comentario[];
  const mio = perfil ? comentarios.find((c) => c.autor_id === perfil.id) ?? null : null;
  const conNota = comentarios.filter((c) => c.calificacion);
  const promedio = conNota.length ? conNota.reduce((a, c) => a + (c.calificacion ?? 0), 0) / conNota.length : null;

  const fotos = imagenesOrdenadas(e);
  const color = e.categorias?.color ?? "#14302a";
  const horarios = [...e.horarios].sort((a, b) => a.dia - b.dia || a.desde.localeCompare(b.desde));
  const publicada = e.estado === "aprobada";
  const wa = e.whatsapp ? e.whatsapp.replace(/\D/g, "") : "";

  return (
    <article className="wrap pagina-exp">
      {!publicada && (
        <p className="aviso" role="status">
          Vista previa: esta experiencia aún no es pública. Estado actual: <strong>{ESTADOS[e.estado]}</strong>.
          {e.motivo_rechazo ? ` Motivo: ${e.motivo_rechazo}` : ""}
        </p>
      )}

      {fotos.length > 0 && (
        <div className={`galeria galeria-${Math.min(fotos.length, 3)}`}>
          {fotos.slice(0, 3).map((f, i) => (
            <img key={f.id} src={urlImagen(f.ruta)} alt={i === 0 ? `Foto de ${e.titulo}` : ""} />
          ))}
        </div>
      )}

      <div className="estacion">
        <div>
          <span className="chip" style={{ color }}>{e.categorias?.nombre ?? "Experiencia"}</span>
          <h1 className="h1-estacion">{e.titulo}</h1>
          <p className="meta">
            Con {e.emprendedor?.nombre ?? "un emprendedor local"}
            {e.lugar ? `, en ${e.lugar}` : ""}
            {e.duracion ? `. Dura ${e.duracion.toLowerCase()}` : ""}.
            {e.precio_clp != null ? ` ${clp(e.precio_clp)} por persona.` : ""}
          </p>

          <blockquote className="historia">{e.historia}</blockquote>
          <div className="acciones">
            <EscucharHistoria texto={`${e.titulo}. ${e.historia}`} />
            {wa && (
              <a className="btn btn-whatsapp" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M20.5 11.8a8.7 8.7 0 0 1-12.9 7.6L3 20.5l1.2-4.5a8.7 8.7 0 1 1 16.3-4.2Z" />
                  <path d="M8.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.6c-.2.2-.2.4 0 .6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5 0 .4-.2 1.1-.6 1.4-.4.4-1 .6-1.6.5-1-.1-2.3-.7-3.5-1.8-1.4-1.2-2.3-2.8-2.5-3.8-.2-.8 0-1.5.5-2Z" />
                </svg>
                Consultar por WhatsApp
              </a>
            )}
          </div>

          {horarios.length > 0 && (
            <section className="bloque">
              <h2>Horarios</h2>
              <ul className="horarios">
                {horarios.map((h, i) => (
                  <li key={h.id ?? i}>
                    <strong>{DIAS[h.dia]}</strong> de {hora(h.desde)} a {hora(h.hasta)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <PanelSello
          experienciaId={e.id}
          slug={e.slug}
          corto={e.nombre_corto}
          color={color}
          userId={perfil?.id ?? null}
          fechaSello={fechaSello}
          publicada={publicada}
        />
      </div>

      <section className="bloque comentarios">
        <h2>
          Comentarios{" "}
          {promedio !== null && (
            <span className="promedio" aria-label={`Promedio ${promedio.toFixed(1)} de 5`}>
              {estrellas(Math.round(promedio))} {promedio.toFixed(1)}
            </span>
          )}
        </h2>
        {comentarios.length === 0 && <p>Aún no hay comentarios. Quien visite la experiencia y selle su pasaporte podrá dejar el primero.</p>}
        <ul className="lista-com">
          {comentarios.map((c) => (
            <li key={c.id}>
              <p className="meta">
                <strong>{c.autor?.nombre ?? "Viajero"}</strong>
                {c.calificacion ? <span aria-label={`${c.calificacion} de 5`}> {estrellas(c.calificacion)}</span> : null}
                {", "}
                {new Date(c.creado_en).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p>{c.texto}</p>
            </li>
          ))}
        </ul>
        <FormComentario
          experienciaId={e.id}
          userId={perfil?.id ?? null}
          tieneSello={!!fechaSello}
          mio={mio ? { texto: mio.texto, calificacion: mio.calificacion } : null}
        />
      </section>
    </article>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DIAS, slugify, urlImagen, type Categoria, type Experiencia, type Horario, type Imagen } from "@/lib/tipos";

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_MB = 5;
const MAX_FOTOS = 6;

type Props = { ownerId: string; categorias: Categoria[]; inicial?: Experiencia };

export default function FormExperiencia({ ownerId, categorias, inicial }: Props) {
  const router = useRouter();
  const [idActual, setIdActual] = useState<string | null>(inicial?.id ?? null);
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [categoriaId, setCategoriaId] = useState<number>(inicial?.categoria_id ?? categorias[0]?.id ?? 0);
  const [lugar, setLugar] = useState(inicial?.lugar ?? "");
  const [duracion, setDuracion] = useState(inicial?.duracion ?? "");
  const [precio, setPrecio] = useState(inicial?.precio_clp != null ? String(inicial.precio_clp) : "");
  const [whatsapp, setWhatsapp] = useState(inicial?.whatsapp ?? "");
  const [historia, setHistoria] = useState(inicial?.historia ?? "");
  const [horarios, setHorarios] = useState<Horario[]>(
    (inicial?.horarios ?? []).map((h) => ({ dia: h.dia, desde: h.desde.slice(0, 5), hasta: h.hasta.slice(0, 5) }))
  );
  const [existentes, setExistentes] = useState<Imagen[]>([...(inicial?.imagenes ?? [])].sort((a, b) => a.orden - b.orden));
  const [nuevas, setNuevas] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const previews = useMemo(() => nuevas.map((f) => URL.createObjectURL(f)), [nuevas]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  function cambiarHorario(i: number, parche: Partial<Horario>) {
    setHorarios((prev) => prev.map((h, j) => (j === i ? { ...h, ...parche } : h)));
  }

  function elegirArchivos(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(ev.target.files ?? []);
    ev.target.value = "";
    const msgs: string[] = [];
    const ok: File[] = [];
    for (const f of files) {
      if (!EXT[f.type]) msgs.push(`${f.name}: usa JPG, PNG o WebP.`);
      else if (f.size > MAX_MB * 1024 * 1024) msgs.push(`${f.name}: pesa más de ${MAX_MB} MB.`);
      else ok.push(f);
    }
    const cupo = Math.max(MAX_FOTOS - existentes.length - nuevas.length, 0);
    if (ok.length > cupo) msgs.push(`Máximo ${MAX_FOTOS} fotos por experiencia.`);
    setNuevas((prev) => [...prev, ...ok.slice(0, cupo)]);
    setAviso(msgs.join(" "));
  }

  async function quitarExistente(img: Imagen) {
    const supabase = createClient();
    const { error } = await supabase.from("imagenes").delete().eq("id", img.id);
    if (error) {
      setError("No pudimos quitar la foto: " + error.message);
      return;
    }
    await supabase.storage.from("experiencias").remove([img.ruta]);
    setExistentes((prev) => prev.filter((x) => x.id !== img.id));
  }

  async function guardar(revision: boolean) {
    setError("");
    if (!titulo.trim() || !categoriaId || historia.trim().length < 30) {
      setError("Completa el nombre, la categoría y una historia de al menos 30 caracteres.");
      return;
    }
    if (horarios.some((h) => !h.desde || !h.hasta || h.hasta <= h.desde)) {
      setError("En cada horario, la hora de término debe ser posterior a la de inicio.");
      return;
    }
    const precioNum = precio.trim() === "" ? null : Number.parseInt(precio, 10);
    if (precioNum !== null && (Number.isNaN(precioNum) || precioNum < 0)) {
      setError("El precio debe ser un número entero, o déjalo vacío.");
      return;
    }

    setEnviando(true);
    try {
      const supabase = createClient();
      const id = idActual ?? crypto.randomUUID();
      const campos = {
        categoria_id: categoriaId,
        titulo: titulo.trim(),
        nombre_corto: titulo.trim().split(/\s+/)[0].slice(0, 12),
        lugar: lugar.trim() || null,
        duracion: duracion.trim() || null,
        precio_clp: precioNum,
        whatsapp: whatsapp.trim() || null,
        historia: historia.trim(),
        estado: revision ? "pendiente" : "borrador",
        motivo_rechazo: null,
      };

      if (idActual) {
        const { data, error: e } = await supabase.from("experiencias").update(campos).eq("id", id).select("id");
        if (e || !data || data.length === 0) throw new Error(e?.message ?? "No tienes permiso para editar esta experiencia.");
      } else {
        const slug = `${slugify(titulo) || "experiencia"}-${Math.random().toString(36).slice(2, 6)}`;
        const { error: e } = await supabase.from("experiencias").insert({ ...campos, id, emprendedor_id: ownerId, slug });
        if (e) throw new Error(e.message);
        setIdActual(id);
      }

      const del = await supabase.from("horarios").delete().eq("experiencia_id", id);
      if (del.error) throw new Error(del.error.message);
      if (horarios.length > 0) {
        const ins = await supabase
          .from("horarios")
          .insert(horarios.map((h) => ({ experiencia_id: id, dia: h.dia, desde: h.desde, hasta: h.hasta })));
        if (ins.error) throw new Error(ins.error.message);
      }

      let orden = existentes.length ? Math.max(...existentes.map((i) => i.orden)) + 1 : 0;
      for (const f of nuevas) {
        const ruta = `${ownerId}/${id}/${crypto.randomUUID()}.${EXT[f.type]}`;
        const up = await supabase.storage.from("experiencias").upload(ruta, f, { contentType: f.type });
        if (up.error) throw new Error(`No se pudo subir ${f.name}: ${up.error.message}`);
        const { data: fila, error: e2 } = await supabase
          .from("imagenes")
          .insert({ experiencia_id: id, ruta, orden: orden++ })
          .select("id, ruta, orden")
          .single();
        if (e2) throw new Error(e2.message);
        setExistentes((prev) => [...prev, fila as Imagen]);
        setNuevas((prev) => prev.filter((x) => x !== f));
      }

      router.push("/emprendedor");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Inténtalo otra vez.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="form form-exp" onSubmit={(e) => e.preventDefault()}>
      <label>
        Nombre de la experiencia
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Cabalgata al atardecer" />
      </label>

      <label>
        Categoría
        <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </label>

      <div className="dos">
        <label>
          Lugar
          <input value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Sector o camino" />
        </label>
        <label>
          Duración
          <input value={duracion} onChange={(e) => setDuracion(e.target.value)} placeholder="Ej: 2 horas" />
        </label>
      </div>

      <div className="dos">
        <label>
          Precio por persona (CLP)
          <input inputMode="numeric" value={precio} onChange={(e) => setPrecio(e.target.value.replace(/\D/g, ""))} placeholder="Ej: 15000" />
        </label>
        <label>
          WhatsApp para consultas
          <input inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Con código de país: 56912345678" />
        </label>
      </div>

      <label>
        Tu historia
        <textarea value={historia} onChange={(e) => setHistoria(e.target.value)} rows={7} placeholder="¿Quién eres, qué ofreces y por qué lo haces así?" />
        <span className="ayuda">
          {historia.trim().length < 30 ? `Escribe al menos 30 caracteres (${historia.trim().length}).` : "Se ve bien. Esta es la historia que escuchará el viajero."}
        </span>
      </label>

      <fieldset className="grupo">
        <legend>Horarios en que ofreces la experiencia</legend>
        {horarios.length === 0 && <p className="ayuda">Aún no agregas horarios. Si es por reserva, déjalo vacío y explícalo en la historia.</p>}
        {horarios.map((h, i) => (
          <div className="horario-fila" key={i}>
            <select aria-label="Día" value={h.dia} onChange={(e) => cambiarHorario(i, { dia: Number(e.target.value) })}>
              {DIAS.map((d, k) => (
                <option key={d} value={k}>{d}</option>
              ))}
            </select>
            <input type="time" aria-label="Desde" value={h.desde} onChange={(e) => cambiarHorario(i, { desde: e.target.value })} />
            <input type="time" aria-label="Hasta" value={h.hasta} onChange={(e) => cambiarHorario(i, { hasta: e.target.value })} />
            <button type="button" className="btn" onClick={() => setHorarios((prev) => prev.filter((_, j) => j !== i))}>Quitar</button>
          </div>
        ))}
        <button type="button" className="btn" onClick={() => setHorarios((prev) => [...prev, { dia: 5, desde: "10:00", hasta: "13:00" }])}>
          Agregar horario
        </button>
      </fieldset>

      <fieldset className="grupo">
        <legend>Fotos (hasta {MAX_FOTOS}, JPG, PNG o WebP, máximo {MAX_MB} MB cada una)</legend>
        <div className="previews">
          {existentes.map((img) => (
            <div className="preview" key={img.id}>
              <img src={urlImagen(img.ruta)} alt="Foto de la experiencia" />
              <button type="button" className="btn" onClick={() => quitarExistente(img)}>Quitar</button>
            </div>
          ))}
          {nuevas.map((f, i) => (
            <div className="preview" key={previews[i]}>
              <img src={previews[i]} alt={`Foto nueva: ${f.name}`} />
              <button type="button" className="btn" onClick={() => setNuevas((prev) => prev.filter((x) => x !== f))}>Quitar</button>
            </div>
          ))}
        </div>
        {existentes.length + nuevas.length < MAX_FOTOS && (
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={elegirArchivos} aria-label="Agregar fotos" />
        )}
        {aviso && <p className="ayuda" role="status">{aviso}</p>}
      </fieldset>

      <p className="nota">
        Cuando la envías, el equipo curador la revisa antes de publicarla. Si editas una experiencia ya publicada, vuelve a revisión.
      </p>
      <div className="acciones">
        <button type="button" className="btn" disabled={enviando} onClick={() => guardar(false)}>
          {enviando ? "Guardando…" : "Guardar borrador"}
        </button>
        <button type="button" className="btn btn-fill" disabled={enviando} onClick={() => guardar(true)}>
          {enviando ? "Guardando…" : "Enviar a revisión"}
        </button>
      </div>
      {error && <p className="msg-error" role="alert">{error}</p>}
    </form>
  );
}

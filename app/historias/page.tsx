import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SELECT_EXP, imagenesOrdenadas, urlImagen, type Experiencia } from "@/lib/tipos";

export default async function Historias() {
  const { data, error } = await createClient()
    .from("experiencias")
    .select(SELECT_EXP)
    .eq("estado", "aprobada")
    .order("creado_en", { ascending: false });
  const lista = (data ?? []) as unknown as Experiencia[];

  return (
    <div className="wrap seccion">
      <h1>Historias con raíces</h1>
      <p className="sub-seccion">Detrás de cada experiencia hay una persona y una historia.</p>

      {error && <p className="msg-error" role="alert">No pudimos cargar las historias: {error.message}</p>}
      {!error && lista.length === 0 && (
        <div className="vacio">
          <p>Las historias aparecerán aquí cuando se publiquen las primeras experiencias.</p>
        </div>
      )}

      <ul className="lista-historias">
        {lista.map((e) => {
          const foto = imagenesOrdenadas(e)[0];
          const extracto = e.historia.length > 220 ? `${e.historia.slice(0, 220).trimEnd()}…` : e.historia;
          return (
            <li key={e.id}>
              <Link href={`/experiencia/${e.slug}`} className="historia-card">
                <div className="historia-foto" style={{ background: e.categorias?.color ?? "#4b5a2b" }}>
                  {foto ? <img src={urlImagen(foto.ruta)} alt="" loading="lazy" /> : <Leaf size={34} aria-hidden="true" />}
                </div>
                <div>
                  <p className="tarjeta-cat" style={{ color: e.categorias?.color }}>{e.emprendedor?.nombre ?? "Emprendedor local"}</p>
                  <h3>{e.titulo}</h3>
                  <p>{extracto}</p>
                  <span className="ver-mas">Leer y escuchar <ArrowRight size={16} aria-hidden="true" /></span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

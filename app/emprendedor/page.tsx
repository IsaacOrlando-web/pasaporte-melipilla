import Link from "next/link";
import { requireRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ESTADOS, SELECT_EXP, type Experiencia } from "@/lib/tipos";

export default async function PanelEmprendedor() {
  const perfil = await requireRol(["emprendedor", "admin"], "/emprendedor");
  const { data } = await createClient()
    .from("experiencias")
    .select(SELECT_EXP)
    .eq("emprendedor_id", perfil.id)
    .order("creado_en", { ascending: false });
  const lista = (data ?? []) as unknown as Experiencia[];

  return (
    <div className="wrap seccion">
      <h1 className="h1-estacion">Mis experiencias</h1>
      <p className="lead">Hola, {perfil.nombre ?? perfil.email}. Aquí creas y editas lo que ofreces.</p>
      <div className="acciones">
        <Link href="/emprendedor/nueva" className="btn btn-fill">Nueva experiencia</Link>
      </div>

      {lista.length === 0 && <p>Aún no creas ninguna experiencia. Empieza con la primera.</p>}
      <ul className="admin-lista">
        {lista.map((e) => (
          <li key={e.id} className="ficha fila-exp">
            <div>
              <span className={`estado estado-${e.estado}`}>{ESTADOS[e.estado]}</span>
              <h3>{e.titulo}</h3>
              <p className="meta">
                {e.categorias?.nombre}
                {e.lugar ? `, ${e.lugar}` : ""}
              </p>
              {e.estado === "rechazada" && e.motivo_rechazo && (
                <p className="msg-error">Cambios pedidos: {e.motivo_rechazo}</p>
              )}
            </div>
            <div className="acciones">
              <Link href={`/emprendedor/${e.id}`} className="btn">Editar</Link>
              <Link href={`/experiencia/${e.slug}`} className="btn">Ver ficha</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

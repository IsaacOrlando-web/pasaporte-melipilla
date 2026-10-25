import Link from "next/link";
import { AccionExperiencia, AccionSolicitud } from "@/components/AdminAcciones";
import { requireRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SELECT_EXP, type Experiencia } from "@/lib/tipos";

type Solicitud = {
  usuario_id: string;
  nombre_emprendimiento: string;
  telefono: string | null;
  mensaje: string | null;
  perfil: { nombre: string | null } | null;
};

export default async function PanelAdmin() {
  await requireRol(["admin"], "/admin");
  const supabase = createClient();

  const { data: s } = await supabase
    .from("solicitudes_emprendedor")
    .select("usuario_id, nombre_emprendimiento, telefono, mensaje, perfil:perfiles(nombre)")
    .eq("estado", "pendiente")
    .order("creado_en");
  const solicitudes = (s ?? []) as unknown as Solicitud[];

  const { data: p } = await supabase.from("experiencias").select(SELECT_EXP).eq("estado", "pendiente").order("creado_en");
  const pendientes = (p ?? []) as unknown as Experiencia[];

  return (
    <div className="wrap seccion">
      <h1 className="h1-estacion">Revisión</h1>

      <h2 className="sub">Solicitudes de emprendedores</h2>
      {solicitudes.length === 0 && <p>No hay solicitudes pendientes.</p>}
      <ul className="admin-lista">
        {solicitudes.map((x) => (
          <li key={x.usuario_id} className="ficha fila-exp">
            <div>
              <h3>{x.nombre_emprendimiento}</h3>
              <p className="meta">
                Cuenta de {x.perfil?.nombre ?? "sin nombre"}
                {x.telefono ? `, contacto ${x.telefono}` : ""}
              </p>
              {x.mensaje && <p>{x.mensaje}</p>}
            </div>
            <AccionSolicitud usuarioId={x.usuario_id} />
          </li>
        ))}
      </ul>

      <h2 className="sub">Experiencias por aprobar</h2>
      {pendientes.length === 0 && <p>No hay experiencias en revisión.</p>}
      <ul className="admin-lista">
        {pendientes.map((e) => (
          <li key={e.id} className="ficha fila-exp">
            <div>
              <span className="chip" style={{ color: e.categorias?.color }}>{e.categorias?.nombre}</span>
              <h3>{e.titulo}</h3>
              <p className="meta">
                De {e.emprendedor?.nombre ?? "sin nombre"}
                {e.lugar ? `, ${e.lugar}` : ""}. {e.imagenes.length} fotos, {e.horarios.length} horarios.
              </p>
              <Link href={`/experiencia/${e.slug}`} className="btn">Ver ficha completa</Link>
            </div>
            <AccionExperiencia id={e.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

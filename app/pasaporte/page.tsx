import Link from "next/link";
import Sello from "@/components/Sello";
import { requireRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type Fila = { id: string; slug: string; titulo: string; nombre_corto: string; categorias: { color: string } | null };

export default async function Pasaporte() {
  const perfil = await requireRol(["viajero", "emprendedor", "admin"], "/pasaporte");
  const supabase = createClient();
  const { data: exps } = await supabase
    .from("experiencias")
    .select("id, slug, titulo, nombre_corto, categorias(color)")
    .eq("estado", "aprobada")
    .order("creado_en");
  const { data: sellos } = await supabase.from("sellos").select("experiencia_id, creado_en").eq("viajero_id", perfil.id);

  const lista = (exps ?? []) as unknown as Fila[];
  const fechas = new Map((sellos ?? []).map((s) => [s.experiencia_id as string, s.creado_en as string]));
  const n = lista.filter((e) => fechas.has(e.id)).length;

  return (
    <div className="wrap seccion">
      <h1 className="h1-estacion">Mi pasaporte</h1>
      <p className="lead">
        {lista.length === 0
          ? "Aún no hay experiencias publicadas."
          : n === 0
            ? "Aún no tienes sellos. Visita una experiencia, escanea su QR y sella tu primera visita."
            : `Llevas ${n} de ${lista.length} sellos.`}
      </p>

      <div className="sellos-grid">
        {lista.map((e) => (
          <Link key={e.id} href={`/experiencia/${e.slug}`} className="sello-item" aria-label={e.titulo}>
            <Sello e={{ id: e.id, corto: e.nombre_corto, color: e.categorias?.color ?? "#14302a" }} fecha={fechas.get(e.id)} size={150} />
            <span>{e.titulo}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

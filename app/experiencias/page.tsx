import Link from "next/link";
import TarjetaExperiencia from "@/components/TarjetaExperiencia";
import { createClient } from "@/lib/supabase/server";
import { SELECT_EXP, type Categoria, type Experiencia } from "@/lib/tipos";

export default async function Experiencias({ searchParams }: { searchParams: { cat?: string } }) {
  const supabase = createClient();
  const { data: cats } = await supabase.from("categorias").select("*").order("id");
  const categorias = (cats ?? []) as Categoria[];
  const { data, error } = await supabase
    .from("experiencias")
    .select(SELECT_EXP)
    .eq("estado", "aprobada")
    .order("creado_en", { ascending: false });
  const todas = (data ?? []) as unknown as Experiencia[];
  const seleccionada = categorias.find((c) => c.slug === searchParams.cat);
  const lista = seleccionada ? todas.filter((e) => e.categoria_id === seleccionada.id) : todas;

  return (
    <div className="wrap seccion">
      <h1>Experiencias</h1>
      <p className="sub-seccion">Hay muchas formas de vivir el campo. Encuentra la tuya.</p>

      <nav className="filtros" aria-label="Filtrar por categoría">
        <Link href="/experiencias" className="filtro" aria-current={!seleccionada ? "true" : undefined}>Todas</Link>
        {categorias.map((c) => (
          <Link key={c.id} href={`/experiencias?cat=${c.slug}`} className="filtro" aria-current={seleccionada?.id === c.id ? "true" : undefined}>
            {c.nombre}
          </Link>
        ))}
      </nav>

      {error && <p className="msg-error" role="alert">No pudimos cargar las experiencias: {error.message}</p>}
      {!error && lista.length === 0 && (
        <div className="vacio">
          <p>{seleccionada ? "Aún no hay experiencias publicadas en esta categoría." : "Aún no hay experiencias publicadas."}</p>
        </div>
      )}
      <div className="grid-exp">
        {lista.map((e) => (
          <TarjetaExperiencia key={e.id} e={e} />
        ))}
      </div>
    </div>
  );
}

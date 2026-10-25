import { notFound, redirect } from "next/navigation";
import FormExperiencia from "@/components/FormExperiencia";
import QrExperiencia from "@/components/QrExperiencia";
import { requireRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ESTADOS, SELECT_EXP, type Categoria, type Experiencia } from "@/lib/tipos";

export default async function EditarExperiencia({ params }: { params: { id: string } }) {
  const perfil = await requireRol(["emprendedor", "admin"], `/emprendedor/${params.id}`);
  const supabase = createClient();
  const { data } = await supabase.from("experiencias").select(SELECT_EXP).eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const e = data as unknown as Experiencia;
  if (e.emprendedor_id !== perfil.id && perfil.rol !== "admin") redirect("/sin-permiso");

  const { data: cats } = await supabase.from("categorias").select("*").order("id");
  return (
    <div className="wrap seccion login">
      <div className="no-print">
        <h1 className="h1-estacion">Editar experiencia</h1>
        <p className="meta">Estado actual: <strong>{ESTADOS[e.estado]}</strong>{e.motivo_rechazo ? `. Cambios pedidos: ${e.motivo_rechazo}` : ""}</p>
        <FormExperiencia ownerId={e.emprendedor_id} categorias={(cats ?? []) as Categoria[]} inicial={e} />
      </div>
      <QrExperiencia slug={e.slug} titulo={e.titulo} />
    </div>
  );
}

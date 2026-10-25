import FormExperiencia from "@/components/FormExperiencia";
import { requireRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/lib/tipos";

export default async function NuevaExperiencia() {
  const perfil = await requireRol(["emprendedor", "admin"], "/emprendedor/nueva");
  const { data } = await createClient().from("categorias").select("*").order("id");
  return (
    <div className="wrap seccion login">
      <h1 className="h1-estacion">Nueva experiencia</h1>
      <FormExperiencia ownerId={perfil.id} categorias={(data ?? []) as Categoria[]} />
    </div>
  );
}

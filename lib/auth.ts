import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type Rol = "viajero" | "emprendedor" | "admin";
export type Perfil = { id: string; email?: string; nombre: string | null; rol: Rol };

/** Usuario actual con su rol, o null si no ha ingresado. */
export async function getPerfil(): Promise<Perfil | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("perfiles").select("nombre, rol").eq("id", user.id).single();
  return { id: user.id, email: user.email, nombre: data?.nombre ?? null, rol: (data?.rol as Rol) ?? "viajero" };
}

/** Protege una página: exige sesión y uno de los roles indicados. */
export async function requireRol(roles: Rol[], volverA: string) {
  const perfil = await getPerfil();
  if (!perfil) redirect(`/login?next=${encodeURIComponent(volverA)}`);
  if (!roles.includes(perfil.rol)) redirect("/sin-permiso");
  return perfil;
}

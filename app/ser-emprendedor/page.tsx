import Link from "next/link";
import { redirect } from "next/navigation";
import FormSolicitud from "@/components/FormSolicitud";
import { requireRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function SerEmprendedor() {
  const perfil = await requireRol(["viajero", "emprendedor", "admin"], "/ser-emprendedor");
  if (perfil.rol !== "viajero") redirect("/emprendedor");

  const { data: sol } = await createClient()
    .from("solicitudes_emprendedor")
    .select("estado, nombre_emprendimiento")
    .eq("usuario_id", perfil.id)
    .maybeSingle();

  return (
    <div className="wrap seccion login">
      <h1 className="h1-estacion">Ofrece tu experiencia</h1>

      {!sol && (
        <>
          <p className="lead">
            Cuéntanos quién eres y qué ofreces. El equipo curador revisa tu solicitud y, cuando la apruebe,
            podrás publicar tus experiencias con fotos, horarios y tu propia historia.
          </p>
          <FormSolicitud userId={perfil.id} />
        </>
      )}
      {sol?.estado === "pendiente" && (
        <div className="ficha" role="status">
          <h2>Solicitud en revisión</h2>
          <p>
            Recibimos la solicitud de <strong>{sol.nombre_emprendimiento}</strong>. Cuando se apruebe, vuelve a esta
            página y verás tu panel de emprendedor.
          </p>
        </div>
      )}
      {sol?.estado === "rechazada" && (
        <div className="ficha" role="status">
          <h2>Tu solicitud no fue aprobada</h2>
          <p>Escríbenos para conversar qué ajustar y volver a intentarlo.</p>
        </div>
      )}
      {sol?.estado === "aprobada" && (
        <div className="ficha" role="status">
          <h2>Solicitud aprobada</h2>
          <p>Cierra sesión y vuelve a ingresar para activar tu panel.</p>
          <Link href="/emprendedor" className="btn">Ir a mi panel</Link>
        </div>
      )}
    </div>
  );
}

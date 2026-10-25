import Link from "next/link";
import { getPerfil } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function Nav() {
  const perfil = await getPerfil();
  let sellos = 0;
  if (perfil) {
    const { count } = await createClient().from("sellos").select("*", { count: "exact", head: true });
    sellos = count ?? 0;
  }
  const esEmprendedor = perfil?.rol === "emprendedor" || perfil?.rol === "admin";

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="marca">Pasaporte Melipilla</Link>
        <nav aria-label="Principal" className="nav-links">
          <Link href="/#experiencias">Experiencias</Link>
          <Link href="/pasaporte">
            Mi pasaporte
            {sellos > 0 && <span className="contador" aria-label={`${sellos} sellos`}>{sellos}</span>}
          </Link>
          {esEmprendedor ? (
            <Link href="/emprendedor">Mis experiencias</Link>
          ) : (
            <Link href="/ser-emprendedor">Ofrece una experiencia</Link>
          )}
          {perfil?.rol === "admin" && <Link href="/admin">Revisión</Link>}
          {perfil ? (
            <form action="/auth/signout" method="post" className="nav-sesion">
              <span className="meta">{perfil.nombre ?? perfil.email}</span>
              <button type="submit" className="nav-salir">Salir</button>
            </form>
          ) : (
            <Link href="/login">Ingresar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

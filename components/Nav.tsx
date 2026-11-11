import Link from "next/link";
import { getPerfil } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Logo from "./Logo";
import MenuCuenta from "./MenuCuenta";
import Tabs from "./Tabs";

export default async function Nav() {
  const perfil = await getPerfil();
  let sellos = 0;
  if (perfil) {
    const { count } = await createClient().from("sellos").select("*", { count: "exact", head: true });
    sellos = count ?? 0;
  }
  return (
    <header className="nav">
      <div className="nav-top">
        <Link href="/" aria-label="RAÍCES, ir al inicio">
          <Logo />
        </Link>
        <MenuCuenta
          autenticado={!!perfil}
          nombre={perfil?.nombre ?? perfil?.email ?? null}
          esEmprendedor={perfil?.rol === "emprendedor" || perfil?.rol === "admin"}
          esAdmin={perfil?.rol === "admin"}
          sellos={sellos}
        />
      </div>
      <Tabs />
    </header>
  );
}

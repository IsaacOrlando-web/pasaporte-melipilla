"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type Props = { autenticado: boolean; nombre: string | null; esEmprendedor: boolean; esAdmin: boolean; sellos: number };

export default function MenuCuenta({ autenticado, nombre, esEmprendedor, esAdmin, sellos }: Props) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [abierto]);

  return (
    <div className="menu-cuenta">
      <button
        type="button"
        className="btn-menu"
        aria-expanded={abierto}
        aria-controls="menu-panel"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto((a) => !a)}
      >
        {abierto ? <X size={28} /> : <Menu size={28} />}
      </button>

      {abierto && (
        <>
          <button type="button" className="menu-fondo" tabIndex={-1} aria-hidden="true" onClick={() => setAbierto(false)} />
          <div id="menu-panel" className="menu-panel">
            {autenticado && <p className="menu-saludo">Hola, {nombre ?? "viajero"}</p>}
            <Link href="/pasaporte">
              Mi pasaporte
              {sellos > 0 && <span className="contador" aria-label={`${sellos} sellos`}>{sellos}</span>}
            </Link>
            {esEmprendedor ? <Link href="/emprendedor">Mis experiencias</Link> : <Link href="/ser-emprendedor">Ofrece una experiencia</Link>}
            {esAdmin && <Link href="/admin">Revisión</Link>}
            {autenticado ? (
              <form action="/auth/signout" method="post">
                <button type="submit" className="menu-salir">Salir</button>
              </form>
            ) : (
              <Link href="/login" className="menu-ingresar">Ingresar</Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

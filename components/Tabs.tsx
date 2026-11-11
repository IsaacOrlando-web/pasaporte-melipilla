"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Home, Map, MapPin } from "lucide-react";

const ITEMS = [
  { href: "/", base: "", label: "Inicio", Icono: Home },
  { href: "/experiencias", base: "/experiencia", label: "Experiencias", Icono: Compass },
  { href: "/rutas", base: "/rutas", label: "Rutas", Icono: MapPin },
  { href: "/historias", base: "/historias", label: "Historias", Icono: BookOpen },
  { href: "/territorio", base: "/territorio", label: "Territorio", Icono: Map },
];

export default function Tabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="tabs-app">
      {ITEMS.map(({ href, base, label, Icono }) => {
        const activo = base === "" ? pathname === "/" : pathname.startsWith(base);
        return (
          <Link key={href} href={href} aria-current={activo ? "page" : undefined}>
            <Icono size={24} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

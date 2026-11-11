import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Rutas() {
  return (
    <div className="wrap seccion">
      <h1>Rutas</h1>
      <div className="vacio vacio-grande">
        <MapPin size={44} strokeWidth={1.5} aria-hidden="true" />
        <h2>Muy pronto</h2>
        <p>Estamos armando rutas temáticas que unen varias experiencias en un solo recorrido, con su mapa y su avance en tu pasaporte.</p>
        <Link href="/experiencias" className="btn">Ver experiencias</Link>
      </div>
    </div>
  );
}

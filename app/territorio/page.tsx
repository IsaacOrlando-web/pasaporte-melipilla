import Link from "next/link";
import { Map } from "lucide-react";

export default function Territorio() {
  return (
    <div className="wrap seccion">
      <h1>Territorio</h1>
      <div className="vacio vacio-grande">
        <Map size={44} strokeWidth={1.5} aria-hidden="true" />
        <h2>Muy pronto</h2>
        <p>Aquí vas a conocer Melipilla: su paisaje, su gente y el mapa con la ubicación de cada experiencia.</p>
        <Link href="/historias" className="btn">Leer historias</Link>
      </div>
    </div>
  );
}

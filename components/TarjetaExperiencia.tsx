import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { iconoCategoria } from "@/lib/iconos";
import { imagenesOrdenadas, urlImagen, type Experiencia } from "@/lib/tipos";

export default function TarjetaExperiencia({ e }: { e: Experiencia }) {
  const foto = imagenesOrdenadas(e)[0];
  const color = e.categorias?.color ?? "#4b5a2b";
  const Icono = iconoCategoria(e.categorias?.slug);
  return (
    <Link href={`/experiencia/${e.slug}`} className="tarjeta">
      <div className="tarjeta-img" style={{ background: color }}>
        {foto ? <img src={urlImagen(foto.ruta)} alt="" loading="lazy" /> : <Icono size={46} strokeWidth={1.4} aria-hidden="true" />}
      </div>
      <div className="tarjeta-cuerpo">
        <p className="tarjeta-cat" style={{ color }}>{e.categorias?.nombre ?? "Experiencia"}</p>
        <h3>{e.titulo}</h3>
        <p className="meta">
          {e.emprendedor?.nombre ?? "Emprendedor local"}
          {e.lugar ? `, ${e.lugar}` : ""}
        </p>
        <span className="ver-mas">
          Ver más <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

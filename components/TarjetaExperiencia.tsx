import Link from "next/link";
import { clp, imagenesOrdenadas, urlImagen, type Experiencia } from "@/lib/tipos";

export default function TarjetaExperiencia({ e }: { e: Experiencia }) {
  const foto = imagenesOrdenadas(e)[0];
  const color = e.categorias?.color ?? "#14302a";
  const detalle = [e.duracion, e.precio_clp != null ? clp(e.precio_clp) : null].filter(Boolean).join(", ");
  return (
    <Link href={`/experiencia/${e.slug}`} className="tarjeta">
      <div className="tarjeta-img" style={{ background: color }}>
        {foto && <img src={urlImagen(foto.ruta)} alt="" loading="lazy" />}
      </div>
      <div className="tarjeta-cuerpo">
        <span className="chip" style={{ color }}>{e.categorias?.nombre ?? "Experiencia"}</span>
        <h3>{e.titulo}</h3>
        <p className="meta">
          {e.emprendedor?.nombre ?? "Emprendedor local"}
          {e.lugar ? `, ${e.lugar}` : ""}
        </p>
        {detalle && <p className="meta">{detalle}</p>}
      </div>
    </Link>
  );
}

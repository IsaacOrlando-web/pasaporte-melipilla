import Link from "next/link";

export default function SinPermiso() {
  return (
    <div className="wrap seccion">
      <h1 className="h1-estacion">Esta sección no está disponible para tu cuenta</h1>
      <p>
        Si eres emprendedor y quieres publicar una experiencia, escríbenos para activar tu cuenta.
        Los viajeros pueden seguir usando el pasaporte con normalidad.
      </p>
      <Link href="/" className="btn">Volver al inicio</Link>
    </div>
  );
}

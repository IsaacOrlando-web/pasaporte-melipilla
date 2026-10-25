import Link from "next/link";
import Sello from "@/components/Sello";
import TarjetaExperiencia from "@/components/TarjetaExperiencia";
import { createClient } from "@/lib/supabase/server";
import { SELECT_EXP, type Categoria, type Experiencia } from "@/lib/tipos";

const FECHA = "2026-10-14T12:00:00";
const DEMO = [
  { id: "a", corto: "Desayuno", color: "#a8650f" },
  { id: "b", corto: "Cabalgata", color: "#a8381f" },
  { id: "c", corto: "Bosque", color: "#1f6b57" },
];

export default async function Home({ searchParams }: { searchParams: { cat?: string } }) {
  const supabase = createClient();
  const { data: cats } = await supabase.from("categorias").select("*").order("id");
  const categorias = (cats ?? []) as Categoria[];
  const { data, error } = await supabase
    .from("experiencias")
    .select(SELECT_EXP)
    .eq("estado", "aprobada")
    .order("creado_en", { ascending: false });

  const todas = (data ?? []) as unknown as Experiencia[];
  const seleccionada = categorias.find((c) => c.slug === searchParams.cat);
  const experiencias = seleccionada ? todas.filter((e) => e.categoria_id === seleccionada.id) : todas;

  return (
    <>
      <section className="wrap hero">
        <div>
          <h1>Recorre Melipilla sello a sello</h1>
          <p className="lead">
            Cabalgatas, huertos, bosque y cocinas comunitarias, contados por quienes los habitan.
            Visita cada lugar, escucha su historia y colecciona el sello en tu pasaporte.
          </p>
          <div className="acciones">
            <Link href="/#experiencias" className="btn btn-fill">Ver experiencias</Link>
            <Link href="/ser-emprendedor" className="btn">Ofrezco una experiencia</Link>
          </div>
        </div>
        <div className="hero-sellos" aria-hidden="true">
          <div className="s1"><Sello e={DEMO[0]} fecha={FECHA} size={190} /></div>
          <div className="s2"><Sello e={DEMO[1]} fecha={FECHA} size={160} /></div>
          <div className="s3"><Sello e={DEMO[2]} fecha={FECHA} size={175} /></div>
        </div>
      </section>

      <section className="wrap seccion">
        <h2>Así funciona en terreno</h2>
        <ol className="pasos">
          <li>
            <h3>Llegas a la experiencia</h3>
            <p>Cada emprendedor tiene un cartel con su QR en la entrada. Escaneas con la cámara del celular.</p>
          </li>
          <li>
            <h3>Escuchas su historia</h3>
            <p>Se abre su ficha con fotos, horarios y su historia en texto y audio.</p>
          </li>
          <li>
            <h3>Recibes tu sello y comentas</h3>
            <p>Ingresas con tu correo, sellas tu pasaporte y puedes dejar tu comentario sobre la experiencia.</p>
          </li>
        </ol>
      </section>

      <section id="experiencias" className="wrap seccion">
        <h2>Experiencias</h2>
        <div className="tabs" role="navigation" aria-label="Filtrar por categoría">
          <Link href="/#experiencias" className="tab" aria-current={!seleccionada ? "true" : undefined}>Todas</Link>
          {categorias.map((c) => (
            <Link key={c.id} href={`/?cat=${c.slug}#experiencias`} className="tab" aria-current={seleccionada?.id === c.id ? "true" : undefined}>
              {c.nombre}
            </Link>
          ))}
        </div>

        {error && <p className="msg-error" role="alert">No pudimos cargar las experiencias: {error.message}</p>}
        {!error && experiencias.length === 0 && (
          <p>
            {seleccionada
              ? "Aún no hay experiencias publicadas en esta categoría."
              : "Aún no hay experiencias publicadas. Cuando un emprendedor envíe la suya y sea aprobada, aparecerá aquí."}
          </p>
        )}
        <div className="grid-exp">
          {experiencias.map((e) => (
            <TarjetaExperiencia key={e.id} e={e} />
          ))}
        </div>
      </section>

      <section className="wrap seccion">
        <div className="banda">
          <div>
            <h2>¿Tienes una experiencia en el territorio?</h2>
            <p>
              Crea tu cuenta de emprendedor, publica tu ficha con fotos y horarios, y descarga tu QR.
              El equipo curador la revisa antes de publicarla.
            </p>
          </div>
          <Link href="/ser-emprendedor" className="btn btn-fill">Quiero ofrecer una experiencia</Link>
        </div>
      </section>
    </>
  );
}

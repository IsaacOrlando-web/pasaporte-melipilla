import Link from "next/link";
import { ArrowRight, Leaf, Store } from "lucide-react";
import TarjetaExperiencia from "@/components/TarjetaExperiencia";
import { getPerfil } from "@/lib/auth";
import { iconoCategoria } from "@/lib/iconos";
import { createClient } from "@/lib/supabase/server";
import { SELECT_EXP, imagenesOrdenadas, urlImagen, type Categoria, type Experiencia } from "@/lib/tipos";

export default async function Home() {
  const supabase = createClient();
  const { data: cats } = await supabase.from("categorias").select("*").order("id");
  const categorias = (cats ?? []) as Categoria[];
  const { data, error } = await supabase
    .from("experiencias")
    .select(SELECT_EXP)
    .eq("estado", "aprobada")
    .order("creado_en", { ascending: false })
    .limit(6);
  const recientes = (data ?? []) as unknown as Experiencia[];
  const fotoBanner = recientes.map((e) => imagenesOrdenadas(e)[0]).find(Boolean);

  const perfil = await getPerfil();
  const esEmprendedor = perfil?.rol === "emprendedor" || perfil?.rol === "admin";

  return (
    <>
      <section className="hero-raices">
        <div className="wrap">
          <h1 className="hero-titulo">
            Vuelve a lo <br />
            que importa.
          </h1>
          <p className="hero-sub">Descubre Melipilla a través de sus personas, sabores, naturaleza y tradiciones.</p>
        </div>
      </section>

      <section className="wrap">
        <div className="card-vivir">
          <h2 className="card-titulo">
            <Leaf size={22} aria-hidden="true" /> ¿Qué te gustaría vivir hoy?
          </h2>
          <div className="tiles">
            {categorias.map((c) => {
              const Icono = iconoCategoria(c.slug);
              return (
                <Link key={c.id} href={`/experiencias?cat=${c.slug}`} className="tile">
                  <Icono size={30} strokeWidth={1.7} aria-hidden="true" />
                  <span>{c.nombre}</span>
                </Link>
              );
            })}
          </div>
          <Link href="/experiencias" className="btn btn-fill btn-ancho">
            Explorar experiencias <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="wrap seccion">
        <h2>Descubre nuestras experiencias</h2>
        <p className="sub-seccion">Hay muchas formas de vivir el campo. Encuentra la tuya.</p>
        {error && <p className="msg-error" role="alert">No pudimos cargar las experiencias: {error.message}</p>}
        {!error && recientes.length === 0 && (
          <div className="vacio">
            <p>Aún no hay experiencias publicadas. Cuando un emprendedor envíe la suya y sea aprobada, aparecerá aquí.</p>
          </div>
        )}
        <div className="carrusel">
          {recientes.map((e) => (
            <TarjetaExperiencia key={e.id} e={e} />
          ))}
        </div>
      </section>

      <section className="wrap">
        <Link href="/historias" className="banner-historias">
          <div className="banner-foto">
            {fotoBanner ? <img src={urlImagen(fotoBanner.ruta)} alt="" /> : <Leaf size={38} aria-hidden="true" />}
          </div>
          <div className="banner-texto">
            <h2>Historias con raíces</h2>
            <p>Detrás de cada experiencia hay una historia.</p>
            <span className="link-sub">
              Conoce sus historias <ArrowRight size={16} aria-hidden="true" />
            </span>
          </div>
          <svg className="hojas" viewBox="0 0 80 90" aria-hidden="true">
            <path d="M40 88 C40 60 44 40 62 10" fill="none" stroke="#6f7f3a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M44 50 C60 48 70 38 72 24 C58 26 46 36 44 50Z" fill="#6f7f3a" />
            <path d="M42 66 C26 64 16 54 14 40 C28 42 40 52 42 66Z" fill="#8a9a52" />
            <path d="M52 30 C48 18 52 8 62 2 C66 14 62 24 52 30Z" fill="#6f7f3a" />
          </svg>
        </Link>
      </section>

      <div className="barra-cta">
        <div className="barra-cta-in">
          <Store size={34} strokeWidth={1.6} aria-hidden="true" />
          <p>
            <strong>{esEmprendedor ? "Gestiona lo que ofreces" : "¿Tienes un emprendimiento en Melipilla?"}</strong>
            <span>{esEmprendedor ? "Crea y edita tus experiencias." : "Tu historia también es parte de RAÍCES."}</span>
          </p>
          <Link href={esEmprendedor ? "/emprendedor" : "/ser-emprendedor"} className="btn btn-claro">
            {esEmprendedor ? "Mis experiencias" : "Quiero ser parte"}
          </Link>
        </div>
      </div>
    </>
  );
}

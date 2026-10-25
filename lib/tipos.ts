export type Categoria = { id: number; slug: string; nombre: string; color: string };
export type Imagen = { id: string; ruta: string; orden: number };
export type Horario = { id?: string; dia: number; desde: string; hasta: string };
export type Estado = "borrador" | "pendiente" | "aprobada" | "rechazada";

export type Experiencia = {
  id: string;
  slug: string;
  titulo: string;
  nombre_corto: string;
  lugar: string | null;
  duracion: string | null;
  historia: string;
  precio_clp: number | null;
  whatsapp: string | null;
  estado: Estado;
  motivo_rechazo: string | null;
  emprendedor_id: string;
  categoria_id: number;
  categorias: Categoria | null;
  imagenes: Imagen[];
  horarios: Horario[];
  emprendedor: { nombre: string | null } | null;
};

/** Consulta estándar: experiencia + categoría + fotos + horarios + nombre del emprendedor */
export const SELECT_EXP = "*, categorias(*), imagenes(*), horarios(*), emprendedor:perfiles(nombre)";

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const ESTADOS: Record<Estado, string> = {
  borrador: "Borrador",
  pendiente: "En revisión",
  aprobada: "Publicada",
  rechazada: "Necesita cambios",
};

export function urlImagen(ruta: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/experiencias/${ruta}`;
}

export function clp(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export function hora(t: string) {
  return t.slice(0, 5);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function imagenesOrdenadas(e: Pick<Experiencia, "imagenes">) {
  return [...(e.imagenes ?? [])].sort((a, b) => a.orden - b.orden);
}

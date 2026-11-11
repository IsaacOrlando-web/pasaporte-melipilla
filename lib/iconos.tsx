import { Hammer, Heart, Leaf, Sprout, TreePine, Users, Utensils, type LucideIcon } from "lucide-react";

const MAPA: Record<string, LucideIcon> = {
  naturaleza: TreePine,
  sabores: Utensils,
  productores: Sprout,
  bienestar: Heart,
  oficios: Hammer,
  familia: Users,
  // categorías anteriores, por si aún no se ejecuta paso-7-categorias.sql
  desayuno: Utensils,
  ecuestre: TreePine,
  mindfulness: Heart,
  agro: Sprout,
  comunidad: Users,
  vino: Sprout,
};

export function iconoCategoria(slug?: string | null): LucideIcon {
  return (slug && MAPA[slug]) || Leaf;
}

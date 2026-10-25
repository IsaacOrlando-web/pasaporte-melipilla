# Pasaporte de Bienestar Rural Melipilla

Next.js 14 (App Router, TypeScript) + Supabase (auth, base de datos, almacenamiento).

## Puesta en marcha
1. `npm install`
2. Copia `.env.local.example` como `.env.local` y pega tu Project URL y publishable key de Supabase.
3. En Supabase > SQL Editor ejecuta, en orden: el SQL de los pasos 2 a 4 y luego `supabase/paso-5-migracion.sql`.
4. En Supabase > Authentication > URL Configuration agrega `http://localhost:3000/**` a Redirect URLs.
5. `npm run dev`

## Rutas
- `/` catálogo de experiencias aprobadas, con filtro por categoría
- `/experiencia/[slug]` ficha pública: fotos, historia, horarios, sello y comentarios
- `/pasaporte` sellos del viajero
- `/ser-emprendedor` solicitud para ofrecer experiencias
- `/emprendedor`, `/emprendedor/nueva`, `/emprendedor/[id]` panel del emprendedor (fotos, categoría, horarios, QR)
- `/admin` aprobar emprendedores y experiencias

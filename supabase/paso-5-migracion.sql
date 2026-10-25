-- ==========================================================
-- PASO 5: horarios, precio, contacto y solicitudes de emprendedor
-- Ejecutar UNA vez en Supabase > SQL Editor
-- ==========================================================

-- Datos extra de la experiencia
alter table experiencias add column if not exists precio_clp int check (precio_clp >= 0);
alter table experiencias add column if not exists whatsapp text;

-- ---------- HORARIOS ----------
create table horarios (
  id uuid primary key default gen_random_uuid(),
  experiencia_id uuid not null references experiencias (id) on delete cascade,
  dia int not null check (dia between 0 and 6),   -- 0 = lunes ... 6 = domingo
  desde time not null,
  hasta time not null,
  check (hasta > desde)
);
alter table horarios enable row level security;

create policy "ver horarios" on horarios for select
  using (exists (select 1 from experiencias e where e.id = horarios.experiencia_id));
create policy "emprendedor gestiona horarios" on horarios for all to authenticated
  using (exists (select 1 from experiencias e where e.id = horarios.experiencia_id and e.emprendedor_id = auth.uid()))
  with check (exists (select 1 from experiencias e where e.id = horarios.experiencia_id and e.emprendedor_id = auth.uid()));
create policy "admin gestiona horarios" on horarios for all to authenticated
  using (es_admin()) with check (es_admin());

-- ---------- SOLICITUDES PARA SER EMPRENDEDOR ----------
create table solicitudes_emprendedor (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null unique references perfiles (id) on delete cascade,
  nombre_emprendimiento text not null,
  telefono text,
  mensaje text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  creado_en timestamptz not null default now()
);
alter table solicitudes_emprendedor enable row level security;

create policy "ver mi solicitud" on solicitudes_emprendedor for select to authenticated
  using (usuario_id = auth.uid() or es_admin());
create policy "crear mi solicitud" on solicitudes_emprendedor for insert to authenticated
  with check (usuario_id = auth.uid() and estado = 'pendiente');
create policy "admin gestiona solicitudes" on solicitudes_emprendedor for all to authenticated
  using (es_admin()) with check (es_admin());

-- Aprobar o rechazar: solo un admin puede ejecutarla; al aprobar, el rol pasa a 'emprendedor'
create function resolver_solicitud(p_usuario uuid, p_aprobar boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not es_admin() then
    raise exception 'No autorizado';
  end if;
  update solicitudes_emprendedor
     set estado = case when p_aprobar then 'aprobada' else 'rechazada' end
   where usuario_id = p_usuario;
  if p_aprobar then
    update perfiles set rol = 'emprendedor' where id = p_usuario and rol = 'viajero';
  end if;
end;
$$;
revoke execute on function resolver_solicitud(uuid, boolean) from public, anon;
grant execute on function resolver_solicitud(uuid, boolean) to authenticated;

-- ---------- ALMACENAMIENTO: el admin también puede subir fotos ----------
create policy "admin sube imagenes" on storage.objects for insert to authenticated
  with check (bucket_id = 'experiencias' and es_admin());

-- ==========================================================
-- OPCIONAL: 3 experiencias de ejemplo (a nombre de tu cuenta admin), ya aprobadas.
-- Bórralas desde Table Editor cuando tengas las reales.
-- ==========================================================
insert into experiencias (emprendedor_id, categoria_id, slug, titulo, nombre_corto, lugar, duracion, historia, estado, precio_clp)
select p.id, c.id, v.slug, v.titulo, v.corto, v.lugar, v.duracion, v.historia, 'aprobada', v.precio
from (select id from perfiles where rol = 'admin' order by creado_en limit 1) p
cross join (values
  ('desayuno', 'desayuno-campo-rosa', 'Desayuno de campo en la casa de Rosa', 'Desayuno', 'Camino Los Aromos', '1 hora',
   'Mi abuela amasaba a las cinco de la mañana. Yo sigo haciendo lo mismo: pan amasado en horno de barro, huevos del patio y mermelada de membrillo. Aquí no hay carta: te sientas, te sirvo y conversamos.', 12000),
  ('ecuestre', 'cabalgata-suave-cerro', 'Cabalgata suave por el cerro', 'Cabalgata', 'Cerro Las Palmas', '2 horas',
   'Llevo cuarenta años montando y todavía aprendo de los caballos. Vamos al paso, sin apuro, por senderos de espino y quillay. Si nunca has montado, mejor: voy al lado todo el trayecto.', 25000),
  ('mindfulness', 'bano-de-bosque-peumo', 'Baño de bosque guiado', 'Bosque', 'Quebrada El Peumo', '90 minutos',
   'No venimos a caminar rápido ni a sacar fotos. Venimos a escuchar. Te invito a descalzarte, tocar la corteza del peumo y respirar lento. Terminamos con una infusión de boldo recién cortado.', 18000)
) as v(cat, slug, titulo, corto, lugar, duracion, historia, precio)
join categorias c on c.slug = v.cat;

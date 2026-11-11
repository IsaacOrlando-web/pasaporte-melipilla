-- PASO 7 (opcional): categorías como en el diseño nuevo de RAÍCES
-- Renombra las 6 categorías existentes sin perder las experiencias ya creadas
-- (cada experiencia conserva su categoría, solo cambia el nombre).
-- Ejecutar una vez en Supabase > SQL Editor.
update categorias set slug = 'sabores',     nombre = 'Sabores del campo',      color = '#a8650f' where slug = 'desayuno';
update categorias set slug = 'naturaleza',  nombre = 'Naturaleza',             color = '#3f6b2e' where slug = 'ecuestre';
update categorias set slug = 'bienestar',   nombre = 'Bienestar',              color = '#a04a3c' where slug = 'mindfulness';
update categorias set slug = 'productores', nombre = 'Conocer productores',    color = '#6b1f4a' where slug = 'vino';
update categorias set slug = 'oficios',     nombre = 'Oficios y cultura',      color = '#8a5a2b' where slug = 'agro';
update categorias set slug = 'familia',     nombre = 'Experiencias en familia', color = '#2d5a8c' where slug = 'comunidad';

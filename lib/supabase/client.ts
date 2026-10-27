import { createBrowserClient } from "@supabase/ssr";

/** Cliente para componentes "use client" (botones, formularios). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // <-- Cambiado aquí
  );
}
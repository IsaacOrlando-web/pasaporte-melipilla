import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente para Server Components, route handlers y server actions. */
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // <-- Cambiado aquí
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Se ignora en Server Components: el middleware ya refresca la sesión.
          }
        },
      },
    }
  );
}
// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for RSC, Server Actions, and Route Handlers.
 * Uses the new getAll/setAll cookie API (no deprecation warnings).
 * Note: In Next.js 15, cookies() is async in RSC/SA contexts.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies(); // ✅ Next 15: await required

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Return [{ name, value }]
        getAll() {
          const all = cookieStore.getAll();
          return all.map((c) => ({ name: c.name, value: c.value }));
        },
        // Set cookies provided by Supabase
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  return client;
}

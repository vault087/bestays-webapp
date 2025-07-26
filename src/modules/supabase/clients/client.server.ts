import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";

export const getSupabase = cache(
  async () => await createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_ANON ?? ""),
);

export const getAdminSupabase = cache(
  async () => await createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE ?? ""),
);

async function createClient(url: string, key: string): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

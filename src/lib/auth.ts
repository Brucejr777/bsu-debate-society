// src/lib/auth.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * This client automatically handles reading and writing session cookies to maintain
 * the user's authenticated session across requests.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Helper to get the currently authenticated user and their Officer profile (RBAC data).
 * Returns null if the user is not logged in or doesn't have an officer profile in the DB.
 */
export async function getCurrentOfficer() {
  const supabase = createServerSupabaseClient();
  
  // 1. Get the authenticated Supabase Auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 2. Fetch their corresponding Officer profile (Role & House)
  const { data: officer, error } = await supabase
    .from("officers")
    .select("id, email, full_name, role, house_affiliation")
    .eq("id", user.id)
    .single();

  if (error || !officer) return null;

  return officer;
}
"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/auth";

/**
 * Server Action to handle Admin Login via Supabase Auth.
 * Replaces the old single-password hash logic.
 */
export async function adminLogin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return the error to be displayed in the UI
    return { error: error.message };
  }

  // On success, redirect to the dashboard
  // The middleware will verify the session cookie automatically
  redirect("/admin/dashboard");
}

/**
 * Server Action to handle Admin Logout.
 * Clears the Supabase session and redirects to the login page.
 */
export async function adminLogout() {
  const supabase = createServerSupabaseClient();
  
  await supabase.auth.signOut();
  
  redirect("/admin/login");
}
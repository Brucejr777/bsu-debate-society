// src/actions/register.ts
"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/auth";

export async function registerOfficer(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  if (!email || !password || !fullName) {
    return { error: "All fields are required." };
  }

  const supabase = createServerSupabaseClient();

  // Sign up the user. 
  // The Supabase trigger (handle_new_user) will automatically insert them 
  // into the public.officers table with role = 'pending'.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "pending",
        house: "Society-wide",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to login page. 
  // They will log in, see the "Role Pending" screen, and wait for approval.
  redirect("/admin/login?registered=true");
}
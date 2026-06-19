// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/auth";

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's Officer profile.
 * Used by the frontend (Navbar, Dashboard, Layout) to determine:
 * - Who is logged in (full_name, email)
 * - What role they hold (president, chancellor_bathala, sia, etc.)
 * - Which House they belong to (Bathala, Kabunian, Laon, Manama, Society-wide)
 *
 * This enables the UI to dynamically show/hide sidebar links and
 * restrict data views based on the Constitution's jurisdictional boundaries.
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Verify the user is authenticated via Supabase Auth session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Fetch the corresponding Officer profile from the `officers` table
    const { data: officer, error: profileError } = await supabase
      .from("officers")
      .select("id, email, full_name, role, house_affiliation, created_at")
      .eq("id", user.id)
      .single();

    if (profileError || !officer) {
      // User is authenticated in Supabase Auth but has no officer profile.
      // This can happen if a user signs up but hasn't been assigned a role yet.
      return NextResponse.json(
        {
          error: "Officer profile not found. Contact the Executive Secretary to be assigned a role.",
          user: {
            id: user.id,
            email: user.email,
          },
        },
        { status: 403 }
      );
    }

    // 3. Return the officer profile
    return NextResponse.json({
      officer: {
        id: officer.id,
        email: officer.email,
        full_name: officer.full_name,
        role: officer.role,
        house_affiliation: officer.house_affiliation,
        created_at: officer.created_at,
      },
    });
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
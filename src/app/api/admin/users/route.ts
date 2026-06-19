// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { Role } from "@/lib/rbac";

/**
 * GET /api/admin/users
 * Fetches all officer profiles.
 * RESTRICTED to the President and Executive Secretary.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (officer.role !== Role.PRESIDENT && officer.role !== Role.EXECUTIVE_SECRETARY) {
    return NextResponse.json(
      { error: "Forbidden: Only the President and Executive Secretary can manage officer profiles." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("officers")
    .select("id, email, full_name, role, house_affiliation, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/users
 * Updates an officer's role, house_affiliation, or full_name.
 * RESTRICTED to the President and Executive Secretary.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (officer.role !== Role.PRESIDENT && officer.role !== Role.EXECUTIVE_SECRETARY) {
    return NextResponse.json(
      { error: "Forbidden: Only the President and Executive Secretary can modify officer roles." },
      { status: 403 }
    );
  }

  const { id, role, house_affiliation, full_name } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Officer ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Build the update object with only provided fields
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (role !== undefined) updates.role = role;
  if (house_affiliation !== undefined) updates.house_affiliation = house_affiliation;
  if (full_name !== undefined) updates.full_name = full_name;

  // Auto-sync house affiliation for chancellor roles
  if (role === "chancellor_bathala") updates.house_affiliation = "Bathala";
  if (role === "chancellor_kabunian") updates.house_affiliation = "Kabunian";
  if (role === "chancellor_laon") updates.house_affiliation = "Laon";
  if (role === "chancellor_manama") updates.house_affiliation = "Manama";

  // High Council roles should be Society-wide unless explicitly set
  const highCouncilRoles = [
    "president", "vice_president", "executive_secretary",
    "sia", "oia_director", "ofra", "external_affairs",
    "business_affairs", "public_affairs", "chief_adviser",
  ];
  if (role && highCouncilRoles.includes(role) && house_affiliation === undefined) {
    updates.house_affiliation = "Society-wide";
  }

  // Note: The RLS policy on officers table only allows users to update their OWN profile.
  // Since the President/Exec Sec is updating OTHER users' profiles, we need to use 
  // the service role key here as a controlled exception for user management.
  // This is the ONE legitimate use case for the service role key in the RBAC system.
  const adminSupabase = require("@supabase/supabase-js").createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await adminSupabase
    .from("officers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
// src/app/api/admin/awards/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/awards
 * Fetches all individual awards.
 * JURISDICTION: High Council and House Chancellors (Selection Committee).
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the officer is part of the High Council or a House Chancellor
  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/awards")) {
    return NextResponse.json(
      { error: "Forbidden: Only the Selection Committee (High Council and House Chancellors) can manage awards." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("individual_awards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/admin/awards
 * Creates a new individual award record.
 * JURISDICTION: Selection Committee (High Council and House Chancellors).
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/awards")) {
    return NextResponse.json(
      { error: "Forbidden: Only the Selection Committee can confer individual awards." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("individual_awards")
    .insert({
      member_name: body.member_name,
      house: body.house,
      award_category: body.award_category,
      tier: body.tier,
      semester: body.semester,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/admin/awards
 * Updates an existing individual award record.
 * JURISDICTION: Selection Committee.
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/awards")) {
    return NextResponse.json(
      { error: "Forbidden: Only the Selection Committee can modify individual awards." },
      { status: 403 }
    );
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("individual_awards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/awards
 * Removes an individual award record.
 * JURISDICTION: Selection Committee.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/awards")) {
    return NextResponse.json(
      { error: "Forbidden: Only the Selection Committee can revoke individual awards." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("individual_awards")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
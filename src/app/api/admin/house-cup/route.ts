// src/app/api/admin/house-cup/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/house-cup
 * Fetches all House Cup winners.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/house-cup")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("house_cup_winners")
    .select("*")
    .order("academic_year", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * POST /api/admin/house-cup
 * Records a new House Cup winner.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/house-cup")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("house_cup_winners")
    .insert({
      academic_year: body.academic_year,
      winning_house: body.winning_house,
      final_points: body.final_points || 0,
      runner_up_house: body.runner_up_house || null,
      runner_up_points: body.runner_up_points || null,
      tiebreaker_used: body.tiebreaker_used || null,
      notable_achievements: body.notable_achievements || null,
      published: body.published !== false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * PUT /api/admin/house-cup
 * Updates a House Cup winner record.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/house-cup")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("house_cup_winners")
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
 * DELETE /api/admin/house-cup
 * Removes a House Cup winner record.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/house-cup")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from("house_cup_winners")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
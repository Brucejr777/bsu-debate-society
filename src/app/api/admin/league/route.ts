// src/app/api/admin/league/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/league
 * Fetches the current Debate League roster.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Enforce RBAC: High Council and House Chancellors can manage the league
  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/league")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage the Debate League." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("debate_league_members")
    .select("*")
    .order("rank", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/admin/league
 * Adds a new member to the Debate League roster.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/league")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage the Debate League." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("debate_league_members")
    .insert({
      member_name: body.member_name,
      house: body.house,
      individual_points: body.individual_points,
      semester: body.semester,
      rank: body.rank,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/admin/league
 * Updates an existing Debate League member's details or rank.
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/league")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage the Debate League." },
      { status: 403 }
    );
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("debate_league_members")
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
 * DELETE /api/admin/league
 * Removes a member from the Debate League roster.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/league")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage the Debate League." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("debate_league_members")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
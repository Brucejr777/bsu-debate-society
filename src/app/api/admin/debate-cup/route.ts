// src/app/api/admin/debate-cup/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/debate-cup
 * Fetches all Inter-House Debate Cup matches.
 * JURISDICTION: High Council and House Chancellors (Rules Art. I, Sec. 10).
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/debate-cup")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage the Debate Cup." }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("debate_cup_matches")
    .select("*")
    .order("match_date", { ascending: true })
    .order("round_number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/admin/debate-cup
 * Schedules a new Debate Cup match.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/debate-cup")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage the Debate Cup." }, { status: 403 });
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("debate_cup_matches")
    .insert({
      semester: body.semester,
      round_number: body.round_number || 1,
      match_date: body.match_date || null,
      match_time: body.match_time || null,
      venue: body.venue || null,
      virtual_link: body.virtual_link || null,
      house_a: body.house_a,
      house_b: body.house_b,
      motion: body.motion || null,
      status: body.status || "scheduled",
      published: body.published || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/admin/debate-cup
 * Updates match details, results, or publication status.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/debate-cup")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage the Debate Cup." }, { status: 403 });
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("debate_cup_matches")
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
 * DELETE /api/admin/debate-cup
 * Removes a match from the schedule.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/debate-cup")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage the Debate Cup." }, { status: 403 });
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("debate_cup_matches")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
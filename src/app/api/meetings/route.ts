// src/app/api/meetings/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, isHouseChancellor } from "@/lib/rbac";

/**
 * GET /api/meetings
 * Fetches meetings. 
 * - Public/Anon users can only view PUBLISHED meetings (Transparency).
 * - Authenticated admins can view ALL meetings (including drafts/unpublished).
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false });

  // Enforce Public Transparency: Anon users only see published meetings
  if (!officer) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Meetings GET error:", error);
    if (error.code === "42P01") return NextResponse.json([]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/meetings
 * Creates a new meeting.
 * Restricted to High Council and House Chancellors.
 * House Chancellors can ONLY create "house_assembly" meetings.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Check general admin route access
  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/meetings")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  // 2. Enforce House Autonomy (Constitution Art. 7, Sec. 1)
  // House Chancellors govern their own House Assemblies, but not Society-wide meetings.
  if (isHouseChancellor(officer.role) && body.meeting_type !== "house_assembly") {
    return NextResponse.json(
      { error: "House Chancellors can only schedule and manage House Assembly meetings." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("meetings")
    .insert({
      meeting_type: body.meeting_type,
      title: body.title,
      meeting_date: body.meeting_date,
      meeting_time: body.meeting_time || null,
      venue: body.venue || null,
      virtual_link: body.virtual_link || null,
      agenda: body.agenda || null,
      presiding_officer: body.presiding_officer || null,
      status: body.status ?? "scheduled",
      minutes: body.minutes || null,
      published: body.published ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/meetings
 * Updates an existing meeting (e.g., adding minutes, changing status).
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/meetings")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...updates } = await request.json();

  // Enforce House Autonomy if they are trying to change the meeting type
  if (isHouseChancellor(officer.role) && updates.meeting_type && updates.meeting_type !== "house_assembly") {
    return NextResponse.json(
      { error: "House Chancellors can only manage House Assembly meetings." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("meetings")
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
 * DELETE /api/meetings
 * Removes a meeting.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/meetings")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("meetings").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
// src/app/api/admin/house-of-semester/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, Role } from "@/lib/rbac";

/**
 * GET /api/admin/house-of-semester
 * Fetches all House of the Semester recognition records.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/house-of-semester")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("house_of_semester")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * POST /api/admin/house-of-semester
 * Records a new House of the Semester recognition.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/house-of-semester")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("house_of_semester")
    .insert({
      semester: body.semester,
      academic_year: body.academic_year,
      winning_house: body.winning_house,
      final_points: body.final_points || 0,
      bonus_points_awarded: body.bonus_points_awarded ?? 10, // Default +10 per R&P Art. I, Sec. 9(4)
      certificate_issued: body.certificate_issued !== false,
      notes: body.notes || null,
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
 * PUT /api/admin/house-of-semester
 * Updates a House of the Semester recognition record.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/house-of-semester")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("house_of_semester")
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
 * DELETE /api/admin/house-of-semester
 * Removes a House of the Semester recognition record.
 * JURISDICTION: High Council and House Chancellors.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/house-of-semester")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from("house_of_semester")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
// src/app/api/admin/sosa/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, Role } from "@/lib/rbac";

/**
 * GET /api/admin/sosa
 * Fetches all SOSA reports (including drafts).
 * Per RLS policies, any authenticated officer can view all reports for review/archiving.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("sosa_reports")
    .select("*")
    .order("delivered_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/admin/sosa
 * Creates a new SOSA report.
 * STRICTLY RESTRICTED to the President per Constitution Art. 8, Sec. 3(i).
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Presidential Authority
  if (!RBAC.canManageSosa(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Society President can draft or publish the State of the Society Address." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sosa_reports")
    .insert({
      president_name: body.president_name || officer.full_name,
      semester: body.semester,
      academic_year: body.academic_year,
      delivered_date: body.delivered_date || null,
      financial_health: body.financial_health,
      departmental_progress: body.departmental_progress,
      house_performance: body.house_performance,
      presidential_vision: body.presidential_vision,
      additional_remarks: body.additional_remarks || null,
      status: body.status || "draft",
      is_published: body.is_published || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/sosa
 * Updates an existing SOSA report (e.g., changing status to 'final' or 'delivered', or publishing it).
 * STRICTLY RESTRICTED to the President.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Presidential Authority
  if (!RBAC.canManageSosa(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Society President can modify the State of the Society Address." },
      { status: 403 }
    );
  }

  const { id, ...updates } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sosa_reports")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/sosa
 * Permanently removes a SOSA report.
 * STRICTLY RESTRICTED to the President.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Presidential Authority
  if (!RBAC.canManageSosa(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Society President can delete SOSA reports." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("sosa_reports")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
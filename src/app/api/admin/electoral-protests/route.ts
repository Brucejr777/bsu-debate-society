// src/app/api/admin/appeals/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, Role } from "@/lib/rbac";

/**
 * GET /api/admin/appeals
 * Fetches all appeals (Point Disputes, Records Access Denials, Tribunal Appeals).
 * JURISDICTION: High Council, Council of House Chancellors, and Chief Adviser.
 * (Rules Art. I, Sec. 8 | Rules Art. VIII, Sec. 6 | Const. Art. 10, Sec. 5)
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Appellate Jurisdiction RBAC
  if (!RBAC.canManageAppeals(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have the constitutional jurisdiction to manage appeals." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("appeals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/appeals
 * Updates the status, council notes, decision, or presiding authority of an appeal.
 * JURISDICTION: High Council, Council of House Chancellors, and Chief Adviser.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Appellate Jurisdiction RBAC
  if (!RBAC.canManageAppeals(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have the constitutional jurisdiction to adjudicate appeals." },
      { status: 403 }
    );
  }

  const { id, ...updates } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Appeal ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // If a final decision is being rendered, automatically set the decision date
  if (updates.decision_outcome && !updates.decision_date) {
    updates.decision_date = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("appeals")
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
 * DELETE /api/admin/appeals
 * Permanently removes an appeal record.
 * JURISDICTION: High Council, Council of House Chancellors, and Chief Adviser.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Appellate Jurisdiction RBAC
  if (!RBAC.canManageAppeals(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have the constitutional jurisdiction to manage appeals." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Appeal ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("appeals")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
// src/app/api/admin/whistleblower/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, Role } from "@/lib/rbac";

/**
 * GET /api/admin/whistleblower
 * Fetches confidential whistleblower reports.
 * STRICTLY RESTRICTED to OIA, Chief Adviser, and President per 
 * Constitution Art. 3, Sec. 14 & Rules Art. VI, Sec. 4(6).
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Strict Confidentiality RBAC
  if (!RBAC.canViewWhistleblower(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have the constitutional clearance to access confidential whistleblower reports." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("whistleblower_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/whistleblower
 * Updates the status of a whistleblower report (e.g., under_review, resolved).
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Strict Confidentiality RBAC
  if (!RBAC.canViewWhistleblower(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have the constitutional clearance to manage whistleblower reports." },
      { status: 403 }
    );
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("whistleblower_reports")
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
 * DELETE /api/admin/whistleblower
 * Permanently removes a whistleblower report from the database.
 * RESTRICTED to the President only, per RLS policies and institutional oversight.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Only the President can delete whistleblower reports
  if (officer.role !== Role.PRESIDENT) {
    return NextResponse.json(
      { error: "Forbidden: Only the President can permanently delete whistleblower reports." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("whistleblower_reports")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
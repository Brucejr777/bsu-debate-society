// src/app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/messages
 * Fetches all contact messages submitted via the public contact form.
 * JURISDICTION: Office of Public Affairs, High Council, and House Chancellors
 * (Constitution Art. 8, Sec. 11 - Office of Public Affairs manages public inquiries).
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Enforce RBAC: Only High Council and House Chancellors can view messages
  if (!RBAC.canAccessAdminRoute(officer.role as any, "/admin/messages")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to view contact messages." },
      { status: 403 }
    );
  }

  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/messages
 * Updates the read status of a contact message.
 * JURISDICTION: Office of Public Affairs, High Council, and House Chancellors.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role as any, "/admin/messages")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage contact messages." },
      { status: 403 }
    );
  }

  const { id, is_read } = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/messages
 * Permanently removes a contact message from the database.
 * JURISDICTION: Office of Public Affairs, High Council, and House Chancellors.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role as any, "/admin/messages")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to delete contact messages." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
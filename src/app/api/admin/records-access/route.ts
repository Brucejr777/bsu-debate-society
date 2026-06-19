// src/app/api/admin/records-access/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, Role, isHouseChancellor, getHouseFromRole } from "@/lib/rbac";

/**
 * GET /api/admin/records-access
 * Fetches records access requests.
 * Enforces Jurisdiction (R&P Art. VIII, Sec. 4):
 * - Executive Secretary, President, and SIA can view all.
 * - House Chancellors can ONLY view House-level requests for their own House.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  
  let query = supabase
    .from("records_access_requests")
    .select("*")
    .order("created_at", { ascending: false });

  // House Chancellors can only see House-level requests for their own House
  if (isHouseChancellor(officer.role as Role)) {
    const userHouse = getHouseFromRole(officer.role as Role);
    query = query.eq("scope", "House-level").eq("requester_house", userHouse);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/records-access
 * Updates the status, processing notes, or fulfillment details of a request.
 * Validates that the logged-in officer has constitutional jurisdiction over the request scope.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // 1. Fetch the request to verify scope and house before allowing the update
  const { data: accessRequest, error: fetchError } = await supabase
    .from("records_access_requests")
    .select("id, scope, requester_house")
    .eq("id", id)
    .single();

  if (fetchError || !accessRequest) {
    return NextResponse.json({ error: "Request not found or access denied." }, { status: 404 });
  }

  const userHouse = getHouseFromRole(officer.role as Role);

  // 2. Check RBAC permissions
  if (!RBAC.canManageRecordsAccess(officer.role as Role, userHouse, accessRequest.scope, accessRequest.requester_house)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to manage this records access request." },
      { status: 403 }
    );
  }

  // 3. Perform the update
  const { data, error } = await supabase
    .from("records_access_requests")
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
 * DELETE /api/admin/records-access
 * Permanently removes a records access request.
 * Restricted to the Executive Secretary and President to maintain strict archival integrity.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Restrict deletion to Executive Secretary and President for proper record retention (Art. VIII, Sec. 3)
  if (officer.role !== Role.EXECUTIVE_SECRETARY && officer.role !== Role.PRESIDENT) {
    return NextResponse.json(
      { error: "Forbidden: Only the Executive Secretary or President can delete records access requests." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("records_access_requests")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
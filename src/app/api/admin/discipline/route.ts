// src/app/api/admin/discipline/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";

/**
 * GET /api/admin/discipline
 * Fetches paginated disciplinary complaints.
 * Enforces Jurisdiction (R&P Art. VI, Sec. 2):
 * - OIA, President, Chief Adviser can view all.
 * - House Chancellors can ONLY view complaints involving their own House.
 */
export async function GET(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createServerSupabaseClient();

  // The RLS policy (022_rbac_rls_policies.sql) automatically filters the results 
  // based on the logged-in user's role and house_affiliation.
  const { data, error, count } = await supabase
    .from("disciplinary_complaints")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

/**
 * PATCH /api/admin/discipline
 * Updates the status, notes, or sanctions of a disciplinary complaint.
 * Validates that the logged-in officer has constitutional jurisdiction 
 * over the specific House(s) involved in the complaint.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Complaint ID is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // 1. Fetch the complaint to verify jurisdiction before allowing the update
  const { data: complaint, error: fetchError } = await supabase
    .from("disciplinary_complaints")
    .select("id, respondent_house, complainant_house, violation_type")
    .eq("id", id)
    .single();

  if (fetchError || !complaint) {
    return NextResponse.json({ error: "Complaint not found or access denied." }, { status: 404 });
  }

  // 2. Check Jurisdiction (R&P Art. VI, Sec. 2)
  // High Tribunal / OIA / President / Chief Adviser have Society-wide jurisdiction.
  // House Chancellors only have jurisdiction over their own House's minor violations.
  const isHighAuthority = 
    officer.role === "president" || 
    officer.role === "chief_adviser" || 
    officer.role === "oia_director" || 
    officer.role === "sia"; // SIA acts as OIA head / Point Keeper for conduct deductions

  const isChancellor = officer.role.startsWith("chancellor_");
  const userHouse = officer.house_affiliation;

  const hasJurisdiction = 
    isHighAuthority || 
    (isChancellor && userHouse && (
      complaint.respondent_house === userHouse || 
      complaint.complainant_house === userHouse
    ));

  if (!hasJurisdiction) {
    return NextResponse.json(
      { error: "Forbidden: You do not have constitutional jurisdiction over this disciplinary complaint." },
      { status: 403 }
    );
  }

  // 3. Perform the update
  const { data, error } = await supabase
    .from("disciplinary_complaints")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
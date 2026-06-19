// src/app/api/admin/individual-points/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/individual-points
 * Fetches paginated individual debate point transactions.
 * Note: Per Article III, Section 6(2), all Society members have view access 
 * to the ledger, but this admin route requires an authenticated session.
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

  const { data, error, count } = await supabase
    .from("individual_debate_point_transactions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

/**
 * POST /api/admin/individual-points
 * Manually adds or deducts individual debate points and records the transaction.
 * STRICTLY RESTRICTED to the Secretary of Internal Affairs (Point Keeper) 
 * and the President per Rules & Procedures Article III, Section 6.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Point Keeper Authority
  if (!RBAC.canManageIndividualPoints(officer.role as any)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Secretary of Internal Affairs (Point Keeper) or the President can modify the Individual Point Ledger." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();

  // 2. Get the member's current points to compute the new running total
  const { data: member } = await supabase
    .from("debate_league_members")
    .select("individual_points")
    .eq("member_name", body.member_name)
    .eq("house", body.house)
    .order("individual_points", { ascending: false })
    .limit(1)
    .maybeSingle();

  const currentTotal = member?.individual_points ?? 0;
  const newTotal = currentTotal + body.points;

  // 3. Update the member's total points in the league table (if they exist)
  if (member) {
    await supabase
      .from("debate_league_members")
      .update({ individual_points: newTotal })
      .eq("member_name", body.member_name)
      .eq("house", body.house);
  }

  // 4. Record the transaction in the official Individual Debate Point Ledger
  const { data, error } = await supabase
    .from("individual_debate_point_transactions")
    .insert({
      member_name: body.member_name,
      house: body.house,
      points: body.points,
      reason: body.reason || "Individual debate point adjustment",
      evidence: body.evidence || null,
      semester: body.semester || "2026-2027 Second Semester",
      status: "provisional", // Starts as provisional per Annex A, Section 5(3)
      running_total: newTotal,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/individual-points
 * Updates the status of point transactions (e.g., from provisional to final).
 * Supports both single 'id' and bulk array of 'ids'.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Point Keeper Authority
  if (!RBAC.canManageIndividualPoints(officer.role as any)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Secretary of Internal Affairs or the President can approve or dispute point transactions." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { id, ids, ...updates } = body;
  const supabase = createServerSupabaseClient();

  // Support both single 'id' and array of 'ids' for bulk operations
  const targetIds = ids ? ids : (id ? [id] : []);
  if (targetIds.length === 0) {
    return NextResponse.json({ error: "No ID or IDs provided" }, { status: 400 });
  }

  // 2. Update the transactions in a single query
  const { data, error } = await supabase
    .from("individual_debate_point_transactions")
    .update(updates)
    .in("id", targetIds)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/individual-points
 * Removes a transaction from the ledger.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Point Keeper Authority
  if (!RBAC.canManageIndividualPoints(officer.role as any)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Secretary of Internal Affairs or the President can delete ledger entries." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("individual_debate_point_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
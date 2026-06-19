// src/app/api/admin/points/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

const CATEGORY_COL: Record<string, string> = {
  "Competitive Excellence": "competitive_excellence",
  "Organizational Contribution": "organizational_contribution",
  "Governance & Compliance": "governance_compliance",
  "Conduct & Ethics": "conduct_ethics",
};

/**
 * GET /api/admin/points
 * Fetches the current House Point standings.
 */
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  
  // Fetch all house points, ordered by total points descending for the leaderboard
  const { data, error } = await supabase
    .from("house_points")
    .select("*")
    .order("total_points", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

/**
 * PATCH /api/admin/points
 * Adds or deducts points from a House and records the transaction.
 * STRICTLY RESTRICTED to the Secretary of Internal Affairs (Point Keeper) 
 * and the President per Rules & Procedures Art. I, Sec. 4, 7(2), and 11.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Point Keeper Authority
  if (!RBAC.canManageHousePoints(officer.role as any)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Secretary of Internal Affairs (Point Keeper) or the President can modify the House Point Ledger." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { house_name, category, amount, reason, evidence, proposing_house } = body;

  if (!house_name || !category || amount === undefined) {
    return NextResponse.json({ error: "Missing required fields: house_name, category, amount" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const categoryKey = CATEGORY_COL[category] ?? "competitive_excellence";

  // 2. Look up existing row by house_name
  const { data: existing, error: fetchError } = await supabase
    .from("house_points")
    .select("*")
    .eq("house_name", house_name)
    .single();

  // PGRST116 is Supabase's "not found" code, which is expected if the house has no points yet
  if (fetchError && fetchError.code !== "PGRST116") {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const currentCategoryVal = existing?.[categoryKey] ?? 0;
  const currentTotal = existing?.total_points ?? 0;
  const newVal = currentCategoryVal + amount;
  const newTotal = currentTotal + amount;
  const semester = existing?.semester ?? "2026-2027 Second Semester";

  if (existing) {
    // 3a. Update existing house points
    const { data, error } = await supabase
      .from("house_points")
      .update({
        [categoryKey]: newVal,
        total_points: newTotal,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4a. Record the transaction in the ledger
    await supabase.from("house_point_transactions").insert({
      house_name,
      category,
      points: amount,
      reason: reason || `${category} adjustment`,
      evidence: evidence || null,
      proposing_house: proposing_house || null,
      semester,
      status: "provisional", // Per Article I, Section 5(2): Admin postings start as provisional
      running_total: newTotal,
    });

    return NextResponse.json(data);
  }

  // 3b. House row doesn't exist yet — create it
  const { data, error } = await supabase
    .from("house_points")
    .insert({
      house_name,
      total_points: amount,
      competitive_excellence: categoryKey === "competitive_excellence" ? amount : 0,
      organizational_contribution: categoryKey === "organizational_contribution" ? amount : 0,
      governance_compliance: categoryKey === "governance_compliance" ? amount : 0,
      conduct_ethics: categoryKey === "conduct_ethics" ? amount : 0,
      semester,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4b. Record the initial transaction in the ledger
  await supabase.from("house_point_transactions").insert({
    house_name,
    category,
    points: amount,
    reason: reason || `${category} adjustment`,
    evidence: evidence || null,
    proposing_house: proposing_house || null,
    semester,
    status: "provisional",
    running_total: amount,
  });

  return NextResponse.json(data);
}
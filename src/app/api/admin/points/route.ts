import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const CATEGORY_COL: Record<string, string> = {
  "Competitive Excellence": "competitive_excellence",
  "Organizational Contribution": "organizational_contribution",
  "Governance & Compliance": "governance_compliance",
  "Conduct & Ethics": "conduct_ethics",
};

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
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

export async function PATCH(request: Request) {
  const body = await request.json();
  const { house_name, category, amount, reason, evidence, proposing_house } = body;
  
  if (!house_name || !category || amount === undefined) {
    return NextResponse.json({ error: "Missing required fields: house_name, category, amount" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const categoryKey = CATEGORY_COL[category] ?? "competitive_excellence";

  // 1. Look up existing row by house_name
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
    // 2a. Update existing house points
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

    // 3a. Record the transaction in the ledger
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

  // 2b. House row doesn't exist yet — create it
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

  // 3b. Record the initial transaction in the ledger
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
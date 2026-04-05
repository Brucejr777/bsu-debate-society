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
  const { house_name, category, amount, reason, evidence, proposing_house } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Look up existing row by house_name
  const { data: existing } = await supabase
    .from("house_points")
    .select("*")
    .eq("house_name", house_name)
    .single();

  const categoryKey = CATEGORY_COL[category] ?? "competitive_excellence";
  const newVal = (existing?.[categoryKey] ?? 0) + amount;
  const newTotal = (existing?.total_points ?? 0) + amount;

  if (existing) {
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
      console.error("Points PATCH error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Record the transaction
    const semester = existing.semester;
    await supabase
      .from("house_point_transactions")
      .insert({
        house_name,
        category,
        points: amount,
        reason: reason || `${category} adjustment`,
        evidence: evidence || null,
        proposing_house: proposing_house || null,
        semester,
        status: "provisional",
        running_total: newTotal,
      });

    return NextResponse.json(data);
  }

  // House row doesn't exist — create it
  const semester = "2026-2027 Second Semester";
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
    console.error("Points INSERT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Record the transaction
  await supabase
    .from("house_point_transactions")
    .insert({
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

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("individual_debate_point_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get the member's current points to compute running total
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

  // Update the member's points
  if (member) {
    await supabase
      .from("debate_league_members")
      .update({ individual_points: newTotal })
      .eq("member_name", body.member_name)
      .eq("house", body.house);
  }

  // Record the transaction
  const { data, error } = await supabase
    .from("individual_debate_point_transactions")
    .insert({
      member_name: body.member_name,
      house: body.house,
      points: body.points,
      reason: body.reason || "Individual debate point adjustment",
      evidence: body.evidence || null,
      semester: body.semester || "2026-2027 Second Semester",
      status: "provisional",
      running_total: newTotal,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const { id, ...updates } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("individual_debate_point_transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { error } = await supabase
    .from("individual_debate_point_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

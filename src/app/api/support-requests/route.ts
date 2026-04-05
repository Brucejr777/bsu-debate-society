import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("league_support_requests")
    .insert({
      member_name: body.member_name,
      member_house: body.member_house,
      member_email: body.member_email,
      tournament_name: body.tournament_name,
      tournament_date: body.tournament_date,
      tournament_level: body.tournament_level,
      tournament_location: body.tournament_location || null,
      role_in_tournament: body.role_in_tournament || "debater",
      requested_support: body.requested_support,
      estimated_cost: body.estimated_cost ? parseFloat(body.estimated_cost) : null,
      submission_deadline_met: body.submission_deadline_met !== false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

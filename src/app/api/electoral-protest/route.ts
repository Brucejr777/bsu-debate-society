import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("electoral_protests")
    .insert({
      protestant_name: body.protestant_name,
      protestant_house: body.protestant_house,
      protestant_email: body.protestant_email || null,
      protest_ground: body.protest_ground,
      specific_violations: body.specific_violations,
      evidence_summary: body.evidence_summary,
      requested_relief: body.requested_relief,
      witnesses: body.witnesses || null,
      proclamation_date: body.proclamation_date,
      filed_within_deadline: body.filed_within_deadline !== false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

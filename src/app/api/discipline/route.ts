import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("disciplinary_complaints")
    .insert({
      complainant_name: body.complainant_name,
      complainant_house: body.complainant_house,
      respondent_name: body.respondent_name,
      respondent_house: body.respondent_house,
      incident_date: body.incident_date,
      incident_time: body.incident_time,
      incident_location: body.incident_location,
      violation_type: body.violation_type,
      provisions_violated: body.provisions_violated,
      description: body.description,
      evidence_summary: body.evidence_summary,
      witnesses: body.witnesses,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

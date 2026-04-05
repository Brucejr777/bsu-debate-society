import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("records_access_requests")
    .insert({
      requester_name: body.requester_name,
      requester_house: body.requester_house,
      requester_email: body.requester_email,
      records_classification: body.records_classification,
      specific_records_sought: body.specific_records_sought,
      purpose: body.purpose,
      preferred_format: body.preferred_format,
      scope: body.scope,
      additional_notes: body.additional_notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

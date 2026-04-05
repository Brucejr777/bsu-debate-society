import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("appeals")
    .insert({
      appeal_type: body.appeal_type,
      appellant_name: body.appellant_name,
      appellant_house: body.appellant_house,
      appellant_email: body.appellant_email || null,
      disputed_transaction_id: body.disputed_transaction_id || null,
      disputed_transaction_date: body.disputed_transaction_date || null,
      constitutional_ground: body.constitutional_ground || null,
      denied_request_id: body.denied_request_id || null,
      denial_reason: body.denial_reason || null,
      appeal_ground: body.appeal_ground,
      statement_of_appeal: body.statement_of_appeal,
      supporting_evidence: body.supporting_evidence || null,
      requested_relief: body.requested_relief,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

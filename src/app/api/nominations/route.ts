import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("individual_nominations")
    .insert({
      nominator_name: body.nominator_name,
      nominator_house: body.nominator_house,
      nominator_email: body.nominator_email || null,
      nominee_name: body.nominee_name,
      nominee_house: body.nominee_house,
      award_category: body.award_category,
      tier: body.tier || null,
      justification: body.justification,
      supporting_documentation: body.supporting_documentation || null,
      semester: body.semester,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const semester = searchParams.get("semester");

  let query = createClient(supabaseUrl, supabaseServiceKey)
    .from("debate_cup_matches")
    .select("*")
    .order("match_date", { ascending: true })
    .order("round_number", { ascending: true });

  if (semester) query = query.eq("semester", semester);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

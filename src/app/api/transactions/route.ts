import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const house = searchParams.get("house");
  const semester = searchParams.get("semester");

  let query = createClient(supabaseUrl, supabaseServiceKey)
    .from("house_point_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (house) query = query.eq("house_name", house);
  if (semester) query = query.eq("semester", semester);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Existing filters
  const house = searchParams.get("house");
  const semester = searchParams.get("semester");

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  let query = supabase
    .from("house_point_transactions")
    .select("*", { count: "exact" }) // Fetch exact count for pagination logic
    .order("created_at", { ascending: false })
    .range(from, to); // Apply pagination range

  if (house) query = query.eq("house_name", house);
  if (semester) query = query.eq("semester", semester);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Return both data and total count
  return NextResponse.json({ data, count });
}
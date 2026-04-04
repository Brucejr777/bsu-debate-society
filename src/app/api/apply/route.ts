import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("membership_applications")
    .insert({
      full_name: body.full_name,
      student_id: body.student_id,
      college: body.college,
      house_choice: body.house_choice,
      email: body.email,
      phone: body.phone,
      comments: body.comments,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

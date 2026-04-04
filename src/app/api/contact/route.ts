import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("individual_nominations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const { id, ...updates } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // If approving a nomination, also insert into individual_awards
  if (updates.status === "approved") {
    // Fetch the nomination to get the details
    const { data: nomination, error: fetchError } = await supabase
      .from("individual_nominations")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Check if award already exists to avoid duplicates
    const { data: existing } = await supabase
      .from("individual_awards")
      .select("id")
      .eq("member_name", nomination.nominee_name)
      .eq("house", nomination.nominee_house)
      .eq("award_category", nomination.award_category)
      .eq("semester", nomination.semester)
      .maybeSingle();

    if (!existing) {
      const awardTier = updates.tier || nomination.tier || "Emerging Contributor";
      const { error: insertError } = await supabase
        .from("individual_awards")
        .insert({
          member_name: nomination.nominee_name,
          house: nomination.nominee_house,
          award_category: nomination.award_category,
          tier: awardTier,
          semester: nomination.semester,
        });

      if (insertError) {
        return NextResponse.json(
          { error: `Failed to create award: ${insertError.message}` },
          { status: 500 }
        );
      }
    }
  }

  const { data, error } = await supabase
    .from("individual_nominations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { error } = await supabase
    .from("individual_nominations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

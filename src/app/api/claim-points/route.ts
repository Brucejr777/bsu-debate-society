import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      member_name,
      house,
      membership_status,
      activity_date,
      activity_name,
      organizing_body,
      point_category,
      points_claimed,
      evidence_link,
      additional_notes,
    } = body;

    // Validate required fields
    if (
      !member_name ||
      !house ||
      !membership_status ||
      !activity_date ||
      !activity_name ||
      !organizing_body ||
      !point_category ||
      !points_claimed ||
      !evidence_link
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert the claim into the database
    // Note: This assumes a `point_claims` table exists. 
    // If you chose to add these columns to `individual_debate_point_transactions` instead, 
    // update the `.from("point_claims")` string accordingly.
    const { data, error } = await supabase
      .from("point_claims")
      .insert({
        member_name,
        house,
        membership_status,
        activity_date,
        activity_name,
        organizing_body,
        point_category,
        points_claimed: parseInt(points_claimed, 10),
        evidence_link,
        additional_notes: additional_notes || null,
        status: "pending", // pending, approved, or rejected
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase point claim insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit claim. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Claim points API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
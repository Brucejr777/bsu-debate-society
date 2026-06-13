import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      is_anonymous,
      contact_method,
      misconduct_types,
      parties_involved,
      factual_summary,
      supporting_documentation,
    } = body;

    // Validate required fields
    if (!Array.isArray(misconduct_types) || misconduct_types.length === 0) {
      return NextResponse.json(
        { error: "At least one misconduct type must be selected." },
        { status: 400 }
      );
    }

    if (!factual_summary || factual_summary.trim() === "") {
      return NextResponse.json(
        { error: "Factual summary is required." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("whistleblower_reports")
      .insert({
        is_anonymous: is_anonymous ?? true,
        contact_method: is_anonymous ? null : contact_method,
        misconduct_types,
        parties_involved: parties_involved || null,
        factual_summary,
        supporting_documentation: supporting_documentation || null,
        status: "pending", // pending, under_review, resolved
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase whistleblower insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit report. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Whistleblower API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
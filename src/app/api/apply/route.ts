// src/app/api/apply/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { HOUSES } from "@/lib/houses"; // 👈 Import the HOUSES array

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 👇 BULLETPROOF: Find the house object by matching the submitted value, name, or slug
    const selectedHouse = HOUSES.find(
      (h) => h.value === body.house_choice || h.name === body.house_choice || h.name.replace("House of ", "") === body.house_choice
    );
    
    // Fallback to the raw input if for some reason it's not found in the array
    const formalHouseName = selectedHouse ? selectedHouse.name : body.house_choice;

    const { data, error } = await supabase
      .from("membership_applications")
      .insert({
        full_name: body.full_name,
        student_id: body.student_id,
        college: body.college,
        house_choice: body.house_choice,
        email: body.email,
        phone: body.phone || null,
        comments: body.comments || null,
        motivation: body.motivation || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Membership application error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 👇 Use formalHouseName in the email template
    const confirmationHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2 style="color: #171717;">BSU Debate Society</h2>
        <p>Dear <strong>${body.full_name}</strong>,</p>
        <p>We have successfully received your membership application for the <strong>${formalHouseName}</strong>.</p>
        <p>The Council of your chosen House will review your application shortly. You will receive another email once a decision has been made.</p>
        <p>Thank you for your interest in joining the premier debating community at BSU.</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #737373;">This is an automated message from the BSU Debate Society Portal.</p>
      </div>
    `;
    
    await sendEmail(body.email, "Application Received - BSU Debate Society", confirmationHtml);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error in /api/apply:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
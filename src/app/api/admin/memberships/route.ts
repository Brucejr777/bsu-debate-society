import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { getApprovalEmail, getRejectionEmail } from "@/lib/email-templates";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const { id, status, comments } = await request.json();
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Fetch the application to get applicant details
  const { data: application, error: fetchError } = await supabase
    .from("membership_applications")
    .select("full_name, house_choice, email")
    .eq("id", id)
    .single();

  if (fetchError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // 2. Update the status in Supabase
  const { data, error } = await supabase
    .from("membership_applications")
    .update({ status, comments })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Send the notification email
  try {
    if (status === "approved") {
      const emailContent = getApprovalEmail(application.full_name, application.house_choice);
      await sendEmail(application.email, emailContent.subject, emailContent.html);
    } else if (status === "rejected") {
      const emailContent = getRejectionEmail(application.full_name);
      await sendEmail(application.email, emailContent.subject, emailContent.html);
    }
  } catch (emailError) {
    console.error("Failed to send email notification:", emailError);
    // We don't return an error response here because the DB update was successful.
    // The email failure shouldn't block the admin action.
  }

  return NextResponse.json(data);
}
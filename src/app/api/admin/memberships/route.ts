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
  const body = await request.json();
  const { id, ids, status, comments } = body;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Support both single 'id' and array of 'ids' for bulk operations
  const targetIds = ids ? ids : (id ? [id] : []);

  if (targetIds.length === 0) {
    return NextResponse.json({ error: "No ID or IDs provided" }, { status: 400 });
  }

  // 1. Fetch the applications to get applicant details for emails
  const { data: applications, error: fetchError } = await supabase
    .from("membership_applications")
    .select("id, full_name, house_choice, email")
    .in("id", targetIds);

  if (fetchError || !applications || applications.length === 0) {
    return NextResponse.json({ error: "Applications not found" }, { status: 404 });
  }

  // 2. Update the status in Supabase for all target IDs in a single query
  const { data, error } = await supabase
    .from("membership_applications")
    .update({ status, comments })
    .in("id", targetIds)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Send notification emails to all affected applicants
  for (const app of applications) {
    try {
      if (status === "approved") {
        const emailContent = getApprovalEmail(app.full_name, app.house_choice);
        await sendEmail(app.email, emailContent.subject, emailContent.html);
      } else if (status === "rejected") {
        const emailContent = getRejectionEmail(app.full_name);
        await sendEmail(app.email, emailContent.subject, emailContent.html);
      }
    } catch (emailError) {
      console.error(`Failed to send email notification to ${app.email}:`, emailError);
      // We don't return an error response here because the DB update was successful.
      // The email failure shouldn't block the admin action.
    }
  }

  return NextResponse.json(data);
}
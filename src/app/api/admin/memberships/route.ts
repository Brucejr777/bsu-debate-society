// src/app/api/admin/memberships/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, isHouseChancellor, getHouseFromRole, Role } from "@/lib/rbac";
import { sendEmail } from "@/lib/email";
import { HOUSES } from "@/lib/houses"; // 👈 Import the HOUSES array

/**
 * GET /api/admin/memberships
 */
export async function GET(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/memberships")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("membership_applications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const role = officer.role as Role;
  if (isHouseChancellor(role)) {
    const userHouse = getHouseFromRole(role);
    query = query.eq("house_choice", userHouse);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count });
}

/**
 * PATCH /api/admin/memberships
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/memberships")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status, comments } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const role = officer.role as Role;

  // 1. Fetch the application details FIRST
  const { data: currentApp, error: fetchError } = await supabase
    .from("membership_applications")
    .select("email, full_name, house_choice")
    .eq("id", id)
    .single();

  if (fetchError || !currentApp) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // 👇 BULLETPROOF: Find the house object dynamically
  const selectedHouse = HOUSES.find(
    (h) => h.value === currentApp.house_choice || h.name === currentApp.house_choice || h.name.replace("House of ", "") === currentApp.house_choice
  );
  const formalHouseName = selectedHouse ? selectedHouse.name : currentApp.house_choice;

  // Enforce House Autonomy
  if (isHouseChancellor(role)) {
    const userHouse = getHouseFromRole(role);
    if (currentApp.house_choice !== userHouse) {
      return NextResponse.json({ error: "Forbidden: You can only manage applications for your House." }, { status: 403 });
    }
  }

  // 2. Update the application status
  const { data, error } = await supabase
    .from("membership_applications")
    .update({ status, comments: comments || null })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Memberships PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Send Automated Status Email to the Applicant
  const isApproved = status === "approved";
  const subject = isApproved
    ? "Congratulations! Your Membership Application has been Approved"
    : "Update on your Membership Application - BSU Debate Society";

  // 👇 Use formalHouseName in both email templates
  const html = isApproved
    ? `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2 style="color: #059669;">BSU Debate Society</h2>
        <p>Dear <strong>${currentApp.full_name}</strong>,</p>
        <p>We are thrilled to inform you that your application to join the <strong>${formalHouseName}</strong> has been <strong style="color: #059669;">approved</strong>.</p>
        <p>Welcome to the Society! The Executive Secretary will be in touch shortly with the next steps for your onboarding and orientation.</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #737373;">This is an automated message from the BSU Debate Society Portal.</p>
      </div>
    `
    : `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2 style="color: #171717;">BSU Debate Society</h2>
        <p>Dear <strong>${currentApp.full_name}</strong>,</p>
        <p>Thank you for your interest in joining the <strong>${formalHouseName}</strong>.</p>
        <p>After careful review, the Council has decided not to approve your application at this time. We appreciate the effort you put into your application and encourage you to apply again in the future.</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #737373;">This is an automated message from the BSU Debate Society Portal.</p>
      </div>
    `;

  await sendEmail(currentApp.email, subject, html);

  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/memberships
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!RBAC.canAccessAdminRoute(officer.role as Role, "/admin/memberships")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("membership_applications").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
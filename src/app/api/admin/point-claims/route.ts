// src/app/api/admin/point-claims/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

// ── GET: Fetch all point claims ──
export async function GET() {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  
  // RLS (022_rbac_rls_policies.sql) will automatically restrict this view 
  // to the President, SIA, and Vice President.
  const { data, error } = await supabase
    .from("point_claims")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ── PATCH: Update claim status (and automatically insert into ledger if approved) ──
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Point Keeper Authority (Rules Art. III, Sec. 6 & Annex A)
  if (!RBAC.canManageIndividualPoints(officer.role as any)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Secretary of Internal Affairs or the President can approve or reject point claims." },
      { status: 403 }
    );
  }

  const { id, status, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();

  // If the admin is approving the claim, automatically process it into the official ledger
  if (status === "approved") {
    // 1. Fetch the original claim details
    const { data: claim, error: fetchError } = await supabase
      .from("point_claims")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // 2. Get the member's current points to compute the new running total
    const { data: member } = await supabase
      .from("debate_league_members")
      .select("individual_points")
      .eq("member_name", claim.member_name)
      .eq("house", claim.house)
      .order("individual_points", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentTotal = member?.individual_points ?? 0;
    const newTotal = currentTotal + claim.points_claimed;

    // 3. Update the member's total points in the league table (if they exist)
    if (member) {
      await supabase
        .from("debate_league_members")
        .update({ individual_points: newTotal })
        .eq("member_name", claim.member_name)
        .eq("house", claim.house);
    }

    // 4. Record the transaction in the official Individual Debate Point Ledger
    await supabase.from("individual_debate_point_transactions").insert({
      member_name: claim.member_name,
      house: claim.house,
      points: claim.points_claimed,
      reason: `Approved Claim: ${claim.activity_name} (${claim.point_category})`,
      evidence: claim.evidence_link,
      semester: claim.semester || "2026-2027 Second Semester", 
      status: "provisional", // Starts as provisional to allow the standard 7-day petition window (Annex A, Sec 5)
      running_total: newTotal,
    });
  }

  // 5. Update the status of the claim in the point_claims inbox
  const { data, error } = await supabase
    .from("point_claims")
    .update({ status, ...updates })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ── DELETE: Remove a claim from the inbox ──
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Enforce Point Keeper Authority
  if (!RBAC.canManageIndividualPoints(officer.role as any)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Secretary of Internal Affairs or the President can delete point claims." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("point_claims")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
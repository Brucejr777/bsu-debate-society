// src/app/api/admin/nominations/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC } from "@/lib/rbac";

/**
 * GET /api/admin/nominations
 * Fetches paginated individual recognition nominations.
 * JURISDICTION: Selection Committee (High Council and House Chancellors).
 */
export async function GET(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/nominations")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage nominations." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createServerSupabaseClient();
  
  const { data, error, count } = await supabase
    .from("individual_nominations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

/**
 * PATCH /api/admin/nominations
 * Updates the status of nominations (e.g., to 'approved' or 'rejected').
 * If approved, automatically inserts the recipient into the individual_awards table.
 * JURISDICTION: Selection Committee.
 */
export async function PATCH(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/nominations")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage nominations." }, { status: 403 });
  }

  const body = await request.json();
  const { id, ids, ...updates } = body;
  const supabase = createServerSupabaseClient();

  // Support both single 'id' and array of 'ids' for bulk operations
  const targetIds = ids ? ids : (id ? [id] : []);
  if (targetIds.length === 0) {
    return NextResponse.json({ error: "No ID or IDs provided" }, { status: 400 });
  }

  // If approving, also insert into individual_awards for each nomination
  if (updates.status === "approved") {
    const { data: nominations, error: fetchError } = await supabase
      .from("individual_nominations")
      .select("*")
      .in("id", targetIds);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (nominations && nominations.length > 0) {
      for (const nomination of nominations) {
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
              { error: `Failed to create award for ${nomination.nominee_name}: ${insertError.message}` },
              { status: 500 }
            );
          }
        }
      }
    }
  }

  // Update the nominations in a single query
  const { data, error } = await supabase
    .from("individual_nominations")
    .update(updates)
    .in("id", targetIds)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/nominations
 * Removes a nomination from the inbox.
 * JURISDICTION: Selection Committee.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RBAC.canAccessAdminRoute(officer.role, "/admin/nominations")) {
    return NextResponse.json({ error: "Forbidden: You do not have permission to manage nominations." }, { status: 403 });
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("individual_nominations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
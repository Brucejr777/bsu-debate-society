// src/app/api/finance/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient, getCurrentOfficer } from "@/lib/auth";
import { RBAC, Role } from "@/lib/rbac";

/**
 * GET /api/finance
 * Fetches financial records.
 * - Public/Anon users can only view PUBLISHED records (enforced by RLS).
 * - Authenticated officers can view ALL records (including drafts).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "snapshot";
  
  // Use the server client which respects the user's session (or anon if logged out)
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("financial_records")
    .select("*")
    .eq("record_type", type)
    .order("period_start", { ascending: false });

  if (error) {
    console.error("Finance GET error:", error);
    // Return empty array if table doesn't exist yet
    if (error.code === "42P01") {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/finance
 * Creates a new financial record (Snapshot or Report).
 * STRICTLY RESTRICTED to OFRA and the President per Constitution Art. 8, Sec. 8.
 */
export async function POST(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Financial Authority
  if (!RBAC.canManageFinance(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Office of Financial and Resource Affairs (OFRA) or the President can manage financial records." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("financial_records")
    .insert({
      record_type: body.record_type,
      period_start: body.period_start,
      period_end: body.period_end,
      opening_balance: body.opening_balance,
      income_total: body.income_total,
      expenses_total: body.expenses_total,
      closing_balance: body.closing_balance,
      income_breakdown: body.income_breakdown,
      expense_breakdown: body.expense_breakdown,
      notable_transactions: body.notable_transactions,
      notes: body.notes,
      published: body.published ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PUT /api/finance
 * Updates an existing financial record.
 * STRICTLY RESTRICTED to OFRA and the President.
 */
export async function PUT(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Financial Authority
  if (!RBAC.canManageFinance(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Office of Financial and Resource Affairs (OFRA) or the President can manage financial records." },
      { status: 403 }
    );
  }

  const { id, ...updates } = await request.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("financial_records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/finance
 * Permanently removes a financial record.
 * STRICTLY RESTRICTED to OFRA and the President.
 */
export async function DELETE(request: Request) {
  const officer = await getCurrentOfficer();
  if (!officer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Enforce Financial Authority
  if (!RBAC.canManageFinance(officer.role as Role)) {
    return NextResponse.json(
      { error: "Forbidden: Only the Office of Financial and Resource Affairs (OFRA) or the President can manage financial records." },
      { status: 403 }
    );
  }

  const { id } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("financial_records")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
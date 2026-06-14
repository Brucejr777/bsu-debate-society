import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Calculate the date 5 days ago (approaching the 7-day provisional window)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoStr = fiveDaysAgo.toISOString();

  // Calculate the date 7 days ago (the absolute deadline for provisional status)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  // Fetch house point transactions that are 5+ days old and still provisional
  const { data: houseTx, error: houseError } = await supabase
    .from("house_point_transactions")
    .select("id, house_name, points, reason, created_at, status")
    .eq("status", "provisional")
    .lte("created_at", fiveDaysAgoStr)
    .order("created_at", { ascending: true });

  // Fetch individual point transactions that are 5+ days old and still provisional
  const { data: individualTx, error: individualError } = await supabase
    .from("individual_debate_point_transactions")
    .select("id, member_name, house, points, reason, created_at, status")
    .eq("status", "provisional")
    .lte("created_at", fiveDaysAgoStr)
    .order("created_at", { ascending: true });

  if (houseError || individualError) {
    return NextResponse.json(
      { error: houseError?.message || individualError?.message },
      { status: 500 }
    );
  }

  // Map and flag if they are overdue (older than 7 days)
  const formattedHouseTx = (houseTx || []).map((tx: any) => ({
    ...tx,
    type: "house",
    isOverdue: new Date(tx.created_at) <= new Date(sevenDaysAgoStr),
  }));

  const formattedIndividualTx = (individualTx || []).map((tx: any) => ({
    ...tx,
    type: "individual",
    isOverdue: new Date(tx.created_at) <= new Date(sevenDaysAgoStr),
  }));

  return NextResponse.json({
    houseTransactions: formattedHouseTx,
    individualTransactions: formattedIndividualTx,
    summary: {
      totalApproaching: formattedHouseTx.length + formattedIndividualTx.length,
      totalOverdue: 
        formattedHouseTx.filter((t: any) => t.isOverdue).length + 
        formattedIndividualTx.filter((t: any) => t.isOverdue).length,
    },
  });
}
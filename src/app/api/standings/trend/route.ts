import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch all transactions ordered chronologically
  const { data, error } = await supabase
    .from("house_point_transactions")
    .select("created_at, house_name, running_total")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json([]);
  }

  const houses = ["Bathala", "Kabunian", "Laon", "Manama"];
  const monthlyData: Record<string, Record<string, number | null>> = {};

  // Aggregate the latest running total for each house per month
  for (const tx of data) {
    if (!tx.created_at || !tx.house_name || !houses.includes(tx.house_name)) continue;
    
    const date = new Date(tx.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { Bathala: null, Kabunian: null, Laon: null, Manama: null };
    }
    
    // Since data is ordered by created_at ascending, the last entry we see for a month 
    // for a specific house will be the most up-to-date running total for that month.
    if (tx.running_total !== null) {
      monthlyData[monthKey][tx.house_name] = tx.running_total;
    }
  }

  const sortedMonths = Object.keys(monthlyData).sort();
  const result: any[] = [];
  
  // Keep track of the cumulative totals to carry over to months with no new transactions
  let currentTotals: Record<string, number> = { 
    Bathala: 0, 
    Kabunian: 0, 
    Laon: 0, 
    Manama: 0 
  };

  for (const month of sortedMonths) {
    for (const house of houses) {
      const val = monthlyData[month][house];
      if (val !== null && val !== undefined) {
        currentTotals[house] = val;
      }
    }
    
    // Format the month key (e.g., "2023-10") into a readable string (e.g., "Oct 2023")
    const [year, monthNum] = month.split("-");
    const dateObj = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    result.push({
      date: displayDate,
      ...currentTotals,
    });
  }

  return NextResponse.json(result);
}
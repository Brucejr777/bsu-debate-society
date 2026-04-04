import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession } from "@/lib/auth";
import { adminLogout } from "@/actions/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!isValidSession(session)) {
    redirect("/admin/login");
  }

  // Fetch summary counts in parallel
  const [
    { count: pendingApps },
    { count: unreadMessages },
    { data: housePoints },
    { data: leagueMembers },
  ] = await Promise.all([
    supabase
      .from("membership_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("house_points")
      .select("*")
      .order("total_points", { ascending: false })
      .limit(4),
    supabase
      .from("debate_league_members")
      .select("*")
      .order("rank", { ascending: true })
      .limit(5),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-neutral-400">
          Welcome. Here is your Society overview.
        </p>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Applications */}
        <a
          href="/admin/memberships"
          className="group rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">
            Pending Applications
          </p>
          <p className="mt-2 text-4xl font-bold text-white">
            {pendingApps ?? 0}
          </p>
          <p className="mt-1 text-xs text-neutral-500 group-hover:text-neutral-400">
            View &amp; manage →
          </p>
        </a>

        {/* Unread Messages */}
        <a
          href="/admin/messages"
          className="group rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">
            Unread Messages
          </p>
          <p className="mt-2 text-4xl font-bold text-white">
            {unreadMessages ?? 0}
          </p>
          <p className="mt-1 text-xs text-neutral-500 group-hover:text-neutral-400">
            View &amp; manage →
          </p>
        </a>

        {/* House Points Link */}
        <a
          href="/admin/points"
          className="group rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">
            House Points
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Manage Ledger
          </p>
          <p className="mt-1 text-xs text-neutral-500 group-hover:text-neutral-400">
            Add or deduct points →
          </p>
        </a>

        {/* Sign Out */}
        <form action={adminLogout} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30">
          <p className="text-sm font-medium text-neutral-500">Account</p>
          <button
            type="submit"
            className="mt-2 w-full rounded-full border border-neutral-700 bg-transparent px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* House Points Quick View */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          House Point Standings
        </h2>
        {!housePoints || housePoints.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No house point data available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {housePoints.map((hp, idx) => {
              const color = HOUSE_COLORS[hp.house_name] ?? "#666";
              return (
                <article
                  key={hp.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="flex size-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {HOUSE_LABELS[hp.house_name] ?? hp.house_name}
                    </span>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-white">
                    {hp.total_points} pts
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Debate League Quick View */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Top Debate League Members
        </h2>
        {!leagueMembers || leagueMembers.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No league data available yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">
                    House
                  </th>
                  <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {leagueMembers.map((m) => {
                  const color = HOUSE_COLORS[m.house] ?? "#666";
                  return (
                    <tr key={m.id} className="border-b border-neutral-800/50">
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex size-7 items-center justify-center rounded-md text-xs font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {m.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-white">
                        {m.member_name}
                      </td>
                      <td className="px-5 py-3 text-neutral-400">
                        {HOUSE_LABELS[m.house] ?? m.house}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">
                        {m.individual_points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

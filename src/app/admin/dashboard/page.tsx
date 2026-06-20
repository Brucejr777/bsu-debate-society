// src/app/admin/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentOfficer, createServerSupabaseClient } from "@/lib/auth";
import { RBAC, isHouseChancellor, getHouseFromRole, type Role } from "@/lib/rbac";
import { adminLogout } from "@/actions/admin";

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
  const officer = await getCurrentOfficer();
  if (!officer) {
    redirect("/admin/login");
  }
  const role = officer.role as Role;
  const userHouse = isHouseChancellor(role) ? getHouseFromRole(role) : null;
  const supabase = createServerSupabaseClient();

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const fiveDaysAgoStr = fiveDaysAgo.toISOString();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  const [
    appsResult,
    messagesResult,
    housePointsResult,
    leagueResult,
    claimsResult,
    houseTxResult,
    individualTxResult,
  ] = await Promise.all([
    (() => {
      let query = supabase
        .from("membership_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (userHouse) {
        query = query.eq("house_choice", userHouse);
      }
      return query;
    })(),
    RBAC.canAccessAdminRoute(role, "/admin/messages")
      ? supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false)
      : Promise.resolve({ count: 0 }),
    supabase.from("house_points").select("*").order("total_points", { ascending: false }).limit(4),
    supabase.from("debate_league_members").select("*").order("rank", { ascending: true }).limit(5),
    RBAC.canManageIndividualPoints(role)
      ? supabase.from("point_claims").select("*", { count: "exact", head: true }).eq("status", "pending")
      : Promise.resolve({ count: 0 }),
    RBAC.canManageHousePoints(role)
      ? supabase
          .from("house_point_transactions")
          .select("id, house_name, points, reason, created_at, status")
          .eq("status", "provisional")
          .lte("created_at", fiveDaysAgoStr)
      : Promise.resolve({ data: [] }),
    RBAC.canManageIndividualPoints(role)
      ? supabase
          .from("individual_debate_point_transactions")
          .select("id, member_name, house, points, reason, created_at, status")
          .eq("status", "provisional")
          .lte("created_at", fiveDaysAgoStr)
      : Promise.resolve({ data: [] }),
  ]);

  const pendingApps = appsResult.count ?? 0;
  const unreadMessages = messagesResult.count ?? 0;
  const housePoints = housePointsResult.data ?? [];
  const leagueMembers = leagueResult.data ?? [];
  const pendingClaims = claimsResult.count ?? 0;
  const houseTx = houseTxResult.data ?? [];
  const individualTx = individualTxResult.data ?? [];

  const formattedHouseTx = houseTx.map((tx: any) => ({
    ...tx,
    type: "house",
    isOverdue: new Date(tx.created_at) <= new Date(sevenDaysAgoStr),
  }));
  const formattedIndividualTx = individualTx.map((tx: any) => ({
    ...tx,
    type: "individual",
    isOverdue: new Date(tx.created_at) <= new Date(sevenDaysAgoStr),
  }));
  const totalApproaching = formattedHouseTx.length + formattedIndividualTx.length;
  const totalOverdue =
    formattedHouseTx.filter((t: any) => t.isOverdue).length +
    formattedIndividualTx.filter((t: any) => t.isOverdue).length;
  const isPointKeeper = RBAC.canManageHousePoints(role) || RBAC.canManageIndividualPoints(role);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400">
            Welcome, <span className="font-medium text-neutral-200">{officer.full_name}</span>
            <span className="text-neutral-500"> • {role.replace(/_/g, " ")}</span>
          </p>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="rounded-full border border-neutral-700 bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pending Applications */}
        <a
          href="/admin/memberships"
          className="group flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">
            Pending Applications {userHouse && <span className="text-neutral-600">({userHouse})</span>}
          </p>
          <p className="text-4xl font-bold text-white">{pendingApps}</p>
          <p className="text-xs text-neutral-500 group-hover:text-neutral-400">Review &amp; process →</p>
        </a>

        {/* Unread Messages */}
        {RBAC.canAccessAdminRoute(role, "/admin/messages") && (
          <a
            href="/admin/messages"
            className="group flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
          >
            <p className="text-sm font-medium text-neutral-500">Unread Messages</p>
            <p className="text-4xl font-bold text-white">{unreadMessages}</p>
            <p className="text-xs text-neutral-500 group-hover:text-neutral-400">View inbox →</p>
          </a>
        )}

        {/* Pending Point Claims */}
        {isPointKeeper && (
          <a
            href="/admin/point-claims"
            className="group flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-emerald-700"
          >
            <p className="text-sm font-medium text-neutral-500">Pending Point Claims</p>
            <p className="text-4xl font-bold text-white">{pendingClaims}</p>
            <p className="text-xs text-neutral-500 group-hover:text-neutral-400">Verify &amp; approve →</p>
          </a>
        )}

        {/* Data Retention & Compliance */}
        {isPointKeeper && (
          <a
            href="/admin/points"
            className="group flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-amber-700"
          >
            <p className="text-sm font-medium text-neutral-500">Data Retention &amp; Compliance</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white">{totalApproaching}</p>
              {totalOverdue > 0 && (
                <span className="rounded-full bg-red-900/60 px-2 py-0.5 text-xs font-semibold text-red-300">
                  {totalOverdue} overdue
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 group-hover:text-neutral-400">
              Provisional records nearing 7-day finalization →
            </p>
          </a>
        )}

        {/* House Points Link */}
        <a
          href="/admin/points"
          className="group flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">House Points</p>
          <p className="text-lg font-semibold text-white">Manage Ledger</p>
          <p className="text-xs text-neutral-500 group-hover:text-neutral-400">
            {isPointKeeper ? "Add or deduct points →" : "View standings →"}
          </p>
        </a>

        {/* League & Awards Link */}
        <a
          href="/admin/league"
          className="group flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30 transition hover:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">League &amp; Awards</p>
          <p className="text-lg font-semibold text-white">Manage</p>
          <p className="text-xs text-neutral-500 group-hover:text-neutral-400">Members &amp; recognition →</p>
        </a>
      </div>

      {/* House Points Quick View */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">House Point Standings</h2>
        {!housePoints || housePoints.length === 0 ? (
          <p className="text-sm text-neutral-500">No house point data available yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
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
                  <span className="text-lg font-bold tabular-nums text-white">{hp.total_points} pts</span>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Debate League Quick View */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Top Debate League Members</h2>
        {!leagueMembers || leagueMembers.length === 0 ? (
          <p className="text-sm text-neutral-500">No league data available yet.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Rank</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Member</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">House</th>
                  <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Points</th>
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
                      <td className="px-5 py-3 font-medium text-white">{m.member_name}</td>
                      <td className="px-5 py-3 text-neutral-400">{HOUSE_LABELS[m.house] ?? m.house}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">{m.individual_points}</td>
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
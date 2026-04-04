"use client";

import { useState, type FormEvent } from "react";

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];
const AWARD_CATEGORIES = [
  "Leadership Excellence",
  "Communication Excellence",
  "Academic Excellence",
  "Creative Excellence",
];
const TIERS = ["Society Fellow", "Distinguished Member", "Emerging Contributor"];

const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};

interface LeagueMember {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  individual_points: number;
  semester: string;
  rank: number;
}

interface IndividualAward {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  award_category: string;
  tier: string;
  semester: string;
}

export default function AdminLeaguePage() {
  // League
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [leagueLoaded, setLeagueLoaded] = useState(false);
  const [leagueLoading, setLeagueLoading] = useState(false);
  const [showLeagueForm, setShowLeagueForm] = useState(false);
  const [editingMember, setEditingMember] = useState<LeagueMember | undefined>(undefined);

  // Awards
  const [awards, setAwards] = useState<IndividualAward[]>([]);
  const [awardsLoaded, setAwardsLoaded] = useState(false);
  const [awardsLoading, setAwardsLoading] = useState(false);
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [editingAward, setEditingAward] = useState<IndividualAward | undefined>(undefined);

  // Feedback
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchLeague() {
    setLeagueLoading(true);
    setError(null);
    const res = await fetch("/api/admin/league");
    if (!res.ok) {
      setError("Failed to fetch league members.");
      setLeagueLoading(false);
      return;
    }
    setMembers(await res.json());
    setLeagueLoaded(true);
    setLeagueLoading(false);
  }

  async function fetchAwards() {
    setAwardsLoading(true);
    setError(null);
    const res = await fetch("/api/admin/awards");
    if (!res.ok) {
      setError("Failed to fetch awards.");
      setAwardsLoading(false);
      return;
    }
    setAwards(await res.json());
    setAwardsLoaded(true);
    setAwardsLoading(false);
  }

  function flash(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3000);
  }

  // ── League CRUD ──
  async function saveLeague(ev: FormEvent, member?: LeagueMember) {
    ev.preventDefault();
    const form = ev.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    const body = {
      member_name: fd.get("member_name") as string,
      house: fd.get("house") as string,
      individual_points: parseInt(fd.get("individual_points") as string, 10) || 0,
      semester: fd.get("semester") as string,
      rank: parseInt(fd.get("rank") as string, 10) || 0,
    };

    const res = editingMember
      ? await fetch("/api/admin/league", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingMember.id, ...body }),
        })
      : await fetch("/api/admin/league", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save.");
      return;
    }

    flash(editingMember ? "Member updated." : "Member added.");
    setShowLeagueForm(false);
    setEditingMember(undefined);
    await fetchLeague();
  }

  async function deleteMember(id: number) {
    const res = await fetch("/api/admin/league", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to delete.");
      return;
    }
    flash("Member removed.");
    await fetchLeague();
  }

  // ── Awards CRUD ──
  async function saveAward(ev: FormEvent, award?: IndividualAward) {
    ev.preventDefault();
    const form = ev.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    const body = {
      member_name: fd.get("member_name") as string,
      house: fd.get("house") as string,
      award_category: fd.get("award_category") as string,
      tier: fd.get("tier") as string,
      semester: fd.get("semester") as string,
    };

    const res = editingAward
      ? await fetch("/api/admin/awards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAward.id, ...body }),
        })
      : await fetch("/api/admin/awards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save.");
      return;
    }

    flash(editingAward ? "Award updated." : "Award added.");
    setShowAwardForm(false);
    setEditingAward(undefined);
    await fetchAwards();
  }

  async function deleteAward(id: number) {
    const res = await fetch("/api/admin/awards", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to delete.");
      return;
    }
    flash("Award removed.");
    await fetchAwards();
  }

  const inputCls =
    "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const selectCls = inputCls;
  const btnPrimary =
    "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50";
  const btnDanger =
    "rounded-full bg-red-800/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-700";
  const btnEdit =
    "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Debate League & Individual Recognition
        </h1>
        <p className="text-sm text-neutral-400">
          Manage league member rankings and individual recognition awards.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
          {actionMsg}
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* DEBATE LEAGUE SECTION                   */}
      {/* ═══════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Debate League</h2>
          <div className="flex gap-2">
            {!leagueLoaded && (
              <button onClick={fetchLeague} disabled={leagueLoading} className={btnPrimary}>
                {leagueLoading ? "Loading…" : "Load Members"}
              </button>
            )}
            {leagueLoaded && (
              <button onClick={() => { setShowLeagueForm(true); setEditingMember(undefined); }} className={btnPrimary}>
                + Add Member
              </button>
            )}
          </div>
        </div>

        {/* League Form */}
        {showLeagueForm && (
          <form
            onSubmit={(e) => saveLeague(e, editingMember)}
            className="rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6 space-y-4"
          >
            <h3 className="text-lg font-medium text-white">
              {editingMember ? "Edit Member" : "Add Member"}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="league-name" className={labelCls}>Member Name</label>
                <input id="league-name" name="member_name" required placeholder="Juan dela Cruz" defaultValue={editingMember?.member_name} className={inputCls} />
              </div>
              <div>
                <label htmlFor="league-house" className={labelCls}>House</label>
                <select id="league-house" name="house" defaultValue={editingMember?.house ?? HOUSES[0]} className={selectCls}>
                  {HOUSES.map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="league-points" className={labelCls}>Individual Points</label>
                <input id="league-points" name="individual_points" type="number" required defaultValue={editingMember?.individual_points ?? 0} className={inputCls} />
              </div>
              <div>
                <label htmlFor="league-rank" className={labelCls}>Rank</label>
                <input id="league-rank" name="rank" type="number" required defaultValue={editingMember?.rank ?? members.length + 1} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="league-semester" className={labelCls}>Semester</label>
                <input id="league-semester" name="semester" required placeholder="2026-2027 Second Semester" defaultValue={editingMember?.semester ?? "2026-2027 Second Semester"} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>{editingMember ? "Update" : "Add"}</button>
              <button type="button" onClick={() => { setShowLeagueForm(false); setEditingMember(undefined); }} className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* League Table */}
        {leagueLoaded && members.length === 0 && (
          <p className="text-sm text-neutral-500">No league members yet.</p>
        )}
        {leagueLoaded && members.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Rank</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Member</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">House</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider">Points</th>
                  <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-neutral-800/50">
                    <td className="px-5 py-3 font-bold text-white">{m.rank}</td>
                    <td className="px-5 py-3 font-medium text-white">{m.member_name}</td>
                    <td className="px-5 py-3 text-neutral-400">{HOUSE_LABELS[m.house]}</td>
                    <td className="px-5 py-3 font-semibold tabular-nums text-white">{m.individual_points}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingMember(m); setShowLeagueForm(true); }} className={btnEdit}>Edit</button>
                        <button onClick={() => deleteMember(m.id)} className={btnDanger}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* INDIVIDUAL RECOGNITION SECTION          */}
      {/* ═══════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Individual Recognition</h2>
          <div className="flex gap-2">
            {!awardsLoaded && (
              <button onClick={fetchAwards} disabled={awardsLoading} className={btnPrimary}>
                {awardsLoading ? "Loading…" : "Load Awards"}
              </button>
            )}
            {awardsLoaded && (
              <button onClick={() => { setShowAwardForm(true); setEditingAward(undefined); }} className={btnPrimary}>
                + Add Award
              </button>
            )}
          </div>
        </div>

        {/* Award Form */}
        {showAwardForm && (
          <form
            onSubmit={(e) => saveAward(e, editingAward)}
            className="rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6 space-y-4"
          >
            <h3 className="text-lg font-medium text-white">
              {editingAward ? "Edit Award" : "Add Award"}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="award-name" className={labelCls}>Member Name</label>
                <input id="award-name" name="member_name" required placeholder="Maria Santos" defaultValue={editingAward?.member_name} className={inputCls} />
              </div>
              <div>
                <label htmlFor="award-house" className={labelCls}>House</label>
                <select id="award-house" name="house" defaultValue={editingAward?.house ?? HOUSES[0]} className={selectCls}>
                  {HOUSES.map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="award-category" className={labelCls}>Category</label>
                <select id="award-category" name="award_category" defaultValue={editingAward?.award_category ?? AWARD_CATEGORIES[0]} className={selectCls}>
                  {AWARD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="award-tier" className={labelCls}>Tier</label>
                <select id="award-tier" name="tier" defaultValue={editingAward?.tier ?? TIERS[0]} className={selectCls}>
                  {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="award-semester" className={labelCls}>Semester</label>
                <input id="award-semester" name="semester" required placeholder="2026-2027 Second Semester" defaultValue={editingAward?.semester ?? "2026-2027 Second Semester"} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>{editingAward ? "Update" : "Add"}</button>
              <button type="button" onClick={() => { setShowAwardForm(false); setEditingAward(undefined); }} className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Awards List */}
        {awardsLoaded && awards.length === 0 && (
          <p className="text-sm text-neutral-500">No awards yet.</p>
        )}
        {awardsLoaded && awards.length > 0 && (
          <div className="space-y-3">
            {awards.map((a) => (
              <article key={a.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{a.member_name}</h3>
                    <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-400">{a.tier}</span>
                  </div>
                  <p className="text-sm text-neutral-400">{HOUSE_LABELS[a.house]} · {a.award_category}</p>
                  <p className="text-xs text-neutral-600">{a.semester}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingAward(a); setShowAwardForm(true); }} className={btnEdit}>Edit</button>
                  <button onClick={() => deleteAward(a.id)} className={btnDanger}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

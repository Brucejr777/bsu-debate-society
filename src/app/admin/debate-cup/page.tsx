"use client";

import { useState } from "react";

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];

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

const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-neutral-800 text-neutral-300",
  in_progress: "bg-blue-900/60 text-blue-300",
  completed: "bg-emerald-900/60 text-emerald-300",
  postponed: "bg-amber-900/60 text-amber-300",
  cancelled: "bg-red-900/60 text-red-300",
};

interface CupMatch {
  id: number;
  created_at: string;
  semester: string;
  round_number: number;
  match_date: string | null;
  match_time: string | null;
  venue: string | null;
  virtual_link: string | null;
  house_a: string;
  house_b: string;
  motion: string | null;
  status: string;
  winner: string | null;
  is_draw: boolean;
  best_team: string | null;
  house_a_score: number | null;
  house_b_score: number | null;
  adjudicators: string | null;
  notes: string | null;
  published: boolean;
}

const emptyForm = {
  semester: "2026-2027 Second Semester",
  round_number: 1,
  match_date: "",
  match_time: "",
  venue: "",
  virtual_link: "",
  house_a: HOUSES[0],
  house_b: HOUSES[1],
  motion: "",
  status: "scheduled",
  winner: "",
  is_draw: false,
  best_team: "",
  house_a_score: "",
  house_b_score: "",
  adjudicators: "",
  notes: "",
  published: false,
};

export default function AdminDebateCupPage() {
  const [matches, setMatches] = useState<CupMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function fetchMatches() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/debate-cup");
    if (!res.ok) {
      setError("Failed to fetch matches.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMatches(data);
    setFetched(true);
    setLoading(false);
  }

  async function submitMatch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.house_a === form.house_b) {
      setError("House A and House B cannot be the same.");
      return;
    }

    const body = {
      semester: form.semester,
      round_number: form.round_number,
      match_date: form.match_date || null,
      match_time: form.match_time || null,
      venue: form.venue || null,
      virtual_link: form.virtual_link || null,
      house_a: form.house_a,
      house_b: form.house_b,
      motion: form.motion || null,
      status: form.status,
      winner: form.winner || null,
      is_draw: form.is_draw,
      best_team: form.best_team || null,
      house_a_score: form.house_a_score ? parseInt(form.house_a_score, 10) : null,
      house_b_score: form.house_b_score ? parseInt(form.house_b_score, 10) : null,
      adjudicators: form.adjudicators || null,
      notes: form.notes || null,
      published: form.published,
    };

    const res = editingId
      ? await fetch("/api/admin/debate-cup", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        })
      : await fetch("/api/admin/debate-cup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save.");
      return;
    }

    setActionMsg(editingId ? "Match updated." : "Match created.");
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    await fetchMatches();
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteMatch(id: number) {
    const res = await fetch("/api/admin/debate-cup", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setError("Failed to delete.");
      return;
    }
    setMatches((prev) => prev.filter((m) => m.id !== id));
    setActionMsg("Match deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function updateField(id: number, updates: Partial<CupMatch>) {
    const res = await fetch("/api/admin/debate-cup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      setError("Failed to update.");
      return;
    }
    const data = await res.json();
    setMatches((prev) => prev.map((m) => (m.id === id ? data : m)));
  }

  function startEdit(m: CupMatch) {
    setEditingId(m.id);
    setForm({
      semester: m.semester,
      round_number: m.round_number,
      match_date: m.match_date || "",
      match_time: m.match_time || "",
      venue: m.venue || "",
      virtual_link: m.virtual_link || "",
      house_a: m.house_a,
      house_b: m.house_b,
      motion: m.motion || "",
      status: m.status,
      winner: m.winner || "",
      is_draw: m.is_draw,
      best_team: m.best_team || "",
      house_a_score: m.house_a_score?.toString() ?? "",
      house_b_score: m.house_b_score?.toString() ?? "",
      adjudicators: m.adjudicators || "",
      notes: m.notes || "",
      published: m.published,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  const updateForm = (field: string, value: string | boolean | number) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  // Group by round
  const byRound: Record<number, CupMatch[]> = {};
  for (const m of matches) {
    if (!byRound[m.round_number]) byRound[m.round_number] = [];
    byRound[m.round_number].push(m);
  }
  const rounds = Object.entries(byRound).sort(
    (a, b) => parseInt(a[0]) - parseInt(b[0])
  );

  const inputCls =
    "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary =
    "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnSecondary =
    "rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white";
  const btnDanger =
    "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";
  const btnEdit =
    "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Inter-House Debate Cup
        </h1>
        <p className="text-sm text-neutral-400">
          Manage round-robin matches, results, and standings per Article I,
          Section 10(1). Each House debates every other House once per semester.
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

      {/* Load / Add buttons */}
      <div className="flex gap-2">
        {!fetched && (
          <button
            onClick={fetchMatches}
            disabled={loading}
            className={btnPrimary}
          >
            {loading ? "Loading…" : "Load Matches"}
          </button>
        )}
        {fetched && !showForm && (
          <button onClick={startNew} className={btnPrimary}>
            + New Match
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit Match" : "New Match"}
          </h2>
          <form onSubmit={submitMatch} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Semester</label>
                <input value={form.semester} onChange={(e) => updateForm("semester", e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Round</label>
                <input type="number" min="1" value={form.round_number} onChange={(e) => updateForm("round_number", parseInt(e.target.value, 10) || 1)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>House A</label>
                <select value={form.house_a} onChange={(e) => updateForm("house_a", e.target.value)} className={inputCls}>
                  {HOUSES.map((h) => (<option key={h} value={h}>{HOUSE_LABELS[h]}</option>))}
                </select>
              </div>
              <div>
                <label className={labelCls}>House B</label>
                <select value={form.house_b} onChange={(e) => updateForm("house_b", e.target.value)} className={inputCls}>
                  {HOUSES.map((h) => (<option key={h} value={h}>{HOUSE_LABELS[h]}</option>))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.match_date} onChange={(e) => updateForm("match_date", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" value={form.match_time} onChange={(e) => updateForm("match_time", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Venue</label>
                <input value={form.venue} onChange={(e) => updateForm("venue", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Virtual Link</label>
                <input value={form.virtual_link} onChange={(e) => updateForm("virtual_link", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Motion</label>
              <input value={form.motion} onChange={(e) => updateForm("motion", e.target.value)} placeholder='e.g. "This House would..." ' className={inputCls} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className={inputCls}>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="postponed">Postponed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Adjudicators</label>
                <input value={form.adjudicators} onChange={(e) => updateForm("adjudicators", e.target.value)} className={inputCls} />
              </div>
            </div>
            {form.status === "completed" && (
              <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                <h3 className="text-sm font-semibold text-white">Result</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{HOUSE_LABELS[form.house_a]} Score</label>
                    <input type="number" value={form.house_a_score} onChange={(e) => updateForm("house_a_score", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{HOUSE_LABELS[form.house_b]} Score</label>
                    <input type="number" value={form.house_b_score} onChange={(e) => updateForm("house_b_score", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Winner</label>
                    <select value={form.is_draw ? "" : form.winner} onChange={(e) => { updateForm("is_draw", false); updateForm("winner", e.target.value); }} className={inputCls}>
                      <option value="">— select —</option>
                      <option value={form.house_a}>{HOUSE_LABELS[form.house_a]}</option>
                      <option value={form.house_b}>{HOUSE_LABELS[form.house_b]}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm text-neutral-300">
                      <input type="checkbox" checked={form.is_draw} onChange={(e) => { updateForm("is_draw", e.target.checked); if (e.target.checked) updateForm("winner", ""); }} className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500" />
                      Match was a draw
                    </label>
                  </div>
                  <div>
                    <label className={labelCls}>Best Team</label>
                    <select value={form.best_team} onChange={(e) => updateForm("best_team", e.target.value)} className={inputCls}>
                      <option value="">— none —</option>
                      <option value={form.house_a}>{HOUSE_LABELS[form.house_a]}</option>
                      <option value={form.house_b}>{HOUSE_LABELS[form.house_b]}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className={labelCls}>Notes</label>
              <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} rows={2} className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="form_published" checked={form.published} onChange={(e) => updateForm("published", e.target.checked)} className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500" />
              <label htmlFor="form_published" className="text-sm text-neutral-300">Publish to public page</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className={btnPrimary}>{editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className={btnSecondary}>Cancel</button>
            </div>
          </form>
        </article>
      )}

      {/* Matches grouped by round */}
      {fetched && matches.length === 0 && (
        <p className="text-sm text-neutral-500">No matches recorded yet.</p>
      )}

      {fetched && rounds.length > 0 && (
        <div className="space-y-8">
          {rounds.map(([roundNum, roundMatches]) => (
            <div key={roundNum} className="space-y-3">
              <h2 className="text-lg font-semibold text-white">
                Round {roundNum}
              </h2>
              {roundMatches.map((m) => {
                const isExpanded = expandedId === m.id;
                const colorA = HOUSE_COLORS[m.house_a] ?? "#666";
                const colorB = HOUSE_COLORS[m.house_b] ?? "#666";
                return (
                  <article
                    key={m.id}
                    className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: colorA }}
                          >
                            {m.house_a[0]}
                          </div>
                          <span className="text-sm font-medium text-neutral-300">
                            {m.house_a}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-600">vs</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: colorB }}
                          >
                            {m.house_b[0]}
                          </div>
                          <span className="text-sm font-medium text-neutral-300">
                            {m.house_b}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_BADGE[m.status] ?? "bg-neutral-800 text-neutral-300"}`}
                        >
                          {m.status.replace("_", " ")}
                        </span>
                        {m.published && (
                          <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                            published
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(m)}
                          className={btnEdit}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            updateField(m.id, {
                              published: !m.published,
                            })
                          }
                          className={btnEdit}
                        >
                          {m.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => deleteMatch(m.id)}
                          className={btnDanger}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Quick info */}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                      {m.match_date && (
                        <span>
                          {new Date(m.match_date).toLocaleDateString()}
                        </span>
                      )}
                      {m.venue && <span>{m.venue}</span>}
                      {m.motion && <span>Motion: {m.motion}</span>}
                    </div>

                    {/* Expand for details */}
                    {m.status === "completed" && (
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : m.id)
                        }
                        className="mt-2 text-sm font-medium text-neutral-400 transition hover:text-white"
                      >
                        {isExpanded ? "Hide details" : "View result"}
                      </button>
                    )}

                    {isExpanded && (
                      <div className="mt-3 space-y-2 border-t border-neutral-800 pt-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-neutral-500">
                              {m.house_a} score:
                            </span>{" "}
                            <span className="text-white font-semibold">
                              {m.house_a_score ?? "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">
                              {m.house_b} score:
                            </span>{" "}
                            <span className="text-white font-semibold">
                              {m.house_b_score ?? "—"}
                            </span>
                          </div>
                          {!m.is_draw && m.winner && (
                            <div>
                              <span className="text-neutral-500">Winner:</span>{" "}
                              <span className="text-emerald-400 font-semibold">
                                {m.winner}
                              </span>
                            </div>
                          )}
                          {m.is_draw && (
                            <div>
                              <span className="text-neutral-500">Result:</span>{" "}
                              <span className="text-neutral-300 font-semibold">
                                Draw
                              </span>
                            </div>
                          )}
                          {m.best_team && (
                            <div>
                              <span className="text-neutral-500">
                                Best Team:
                              </span>{" "}
                              <span className="text-amber-400 font-semibold">
                                {m.best_team}
                              </span>
                            </div>
                          )}
                        </div>
                        {m.adjudicators && (
                          <p className="text-xs text-neutral-500">
                            Adjudicators: {m.adjudicators}
                          </p>
                        )}
                        {m.notes && (
                          <p className="text-xs text-neutral-500">
                            Notes: {m.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

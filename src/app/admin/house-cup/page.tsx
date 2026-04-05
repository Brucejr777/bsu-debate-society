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

interface CupWinner {
  id: number;
  created_at: string;
  academic_year: string;
  winning_house: string;
  final_points: number;
  runner_up_house: string | null;
  runner_up_points: number | null;
  tiebreaker_used: string | null;
  notable_achievements: string | null;
  published: boolean;
}

const emptyForm = {
  academic_year: "",
  winning_house: HOUSES[0],
  final_points: "",
  runner_up_house: "",
  runner_up_points: "",
  tiebreaker_used: "",
  notable_achievements: "",
  published: true,
};

export default function AdminHouseCupPage() {
  const [winners, setWinners] = useState<CupWinner[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchWinners() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/house-cup");
    if (!res.ok) {
      setError("Failed to fetch winners.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setWinners(data);
    setFetched(true);
    setLoading(false);
  }

  async function submitWinner(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const points = parseInt(form.final_points, 10) || 0;
    const runnerPts = form.runner_up_points
      ? parseInt(form.runner_up_points, 10)
      : null;

    const body = {
      academic_year: form.academic_year,
      winning_house: form.winning_house,
      final_points: points,
      runner_up_house: form.runner_up_house || null,
      runner_up_points: runnerPts,
      tiebreaker_used: form.tiebreaker_used || null,
      notable_achievements: form.notable_achievements || null,
      published: form.published,
    };

    const res = editingId
      ? await fetch("/api/admin/house-cup", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        })
      : await fetch("/api/admin/house-cup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save.");
      return;
    }

    setActionMsg(editingId ? "Winner updated." : "Winner recorded.");
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    await fetchWinners();
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteWinner(id: number) {
    const res = await fetch("/api/admin/house-cup", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setError("Failed to delete.");
      return;
    }
    setWinners((prev) => prev.filter((w) => w.id !== id));
    setActionMsg("Record deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch("/api/admin/house-cup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published: !current }),
    });
    if (!res.ok) {
      setError("Failed to update.");
      return;
    }
    const data = await res.json();
    setWinners((prev) => prev.map((w) => (w.id === id ? data : w)));
  }

  function startEdit(w: CupWinner) {
    setEditingId(w.id);
    setForm({
      academic_year: w.academic_year,
      winning_house: w.winning_house,
      final_points: w.final_points.toString(),
      runner_up_house: w.runner_up_house || "",
      runner_up_points: w.runner_up_points?.toString() ?? "",
      tiebreaker_used: w.tiebreaker_used || "",
      notable_achievements: w.notable_achievements || "",
      published: w.published,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  const updateForm = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

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
          House Cup Champions
        </h1>
        <p className="text-sm text-neutral-400">
          Record and manage annual House Cup winners. Published winners appear
          on the public House Cup page.
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
            onClick={fetchWinners}
            disabled={loading}
            className={btnPrimary}
          >
            {loading ? "Loading…" : "Load Winners"}
          </button>
        )}
        {fetched && !showForm && (
          <button onClick={startNew} className={btnPrimary}>
            + Record Winner
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit Winner" : "Record New Winner"}
          </h2>
          <form onSubmit={submitWinner} className="mx-auto max-w-xl space-y-4">
            <div>
              <label className={labelCls}>Academic Year</label>
              <input
                value={form.academic_year}
                onChange={(e) => updateForm("academic_year", e.target.value)}
                required
                placeholder="2025-2026"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Winning House</label>
              <select
                value={form.winning_house}
                onChange={(e) => updateForm("winning_house", e.target.value)}
                className={inputCls}
              >
                {HOUSES.map((h) => (
                  <option key={h} value={h}>
                    {HOUSE_LABELS[h]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Final Points</label>
              <input
                type="number"
                value={form.final_points}
                onChange={(e) => updateForm("final_points", e.target.value)}
                required
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Runner-Up House</label>
                <select
                  value={form.runner_up_house}
                  onChange={(e) =>
                    updateForm("runner_up_house", e.target.value)
                  }
                  className={inputCls}
                >
                  <option value="">— none —</option>
                  {HOUSES.map((h) => (
                    <option key={h} value={h}>
                      {HOUSE_LABELS[h]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Runner-Up Points</label>
                <input
                  type="number"
                  value={form.runner_up_points}
                  onChange={(e) =>
                    updateForm("runner_up_points", e.target.value)
                  }
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Tiebreaker Used</label>
              <input
                value={form.tiebreaker_used}
                onChange={(e) =>
                  updateForm("tiebreaker_used", e.target.value)
                }
                placeholder="e.g. Most debate competition points"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Notable Achievements</label>
              <textarea
                value={form.notable_achievements}
                onChange={(e) =>
                  updateForm("notable_achievements", e.target.value)
                }
                rows={3}
                placeholder="e.g. First consecutive win, record points..."
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="form_published"
                checked={form.published}
                onChange={(e) => updateForm("published", e.target.checked)}
                className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
              />
              <label
                htmlFor="form_published"
                className="text-sm text-neutral-300"
              >
                Publish to public Hall of Champions
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className={btnPrimary}>
                {editingId ? "Update" : "Record"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </form>
        </article>
      )}

      {/* Winners List */}
      {fetched && winners.length === 0 && (
        <p className="text-sm text-neutral-500">No House Cup winners recorded yet.</p>
      )}

      {fetched && winners.length > 0 && (
        <div className="space-y-4">
          {winners.map((w) => {
            const color = HOUSE_COLORS[w.winning_house] ?? "#666";
            return (
              <article
                key={w.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {w.winning_house[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {HOUSE_LABELS[w.winning_house]?.replace(
                          "House of ",
                          ""
                        ) ?? w.winning_house}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {w.academic_year} · {w.final_points} points
                      </p>
                      {w.runner_up_house && (
                        <p className="text-xs text-neutral-600">
                          Runner-up: {w.runner_up_house} ({w.runner_up_points}{" "}
                          pts)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {w.published && (
                      <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        published
                      </span>
                    )}
                    <button
                      onClick={() => startEdit(w)}
                      className={btnEdit}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublished(w.id, w.published)}
                      className={btnEdit}
                    >
                      {w.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => deleteWinner(w.id)}
                      className={btnDanger}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {w.tiebreaker_used && (
                  <p className="mt-2 text-xs text-amber-500">
                    Tiebreaker: {w.tiebreaker_used}
                  </p>
                )}
                {w.notable_achievements && (
                  <p className="mt-1 text-xs italic text-neutral-500">
                    {w.notable_achievements}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

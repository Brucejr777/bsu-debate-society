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

interface SemWinner {
  id: number;
  created_at: string;
  semester: string;
  academic_year: string;
  winning_house: string;
  final_points: number;
  bonus_points_awarded: number;
  certificate_issued: boolean;
  notes: string | null;
  published: boolean;
}

const emptyForm = {
  semester: "",
  academic_year: "",
  winning_house: HOUSES[0],
  final_points: "",
  bonus_points_awarded: "10",
  certificate_issued: true,
  notes: "",
  published: true,
};

export default function AdminHouseOfSemesterPage() {
  const [winners, setWinners] = useState<SemWinner[]>([]);
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
    const res = await fetch("/api/admin/house-of-semester");
    if (!res.ok) {
      setError("Failed to fetch records.");
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
    const bonus = parseInt(form.bonus_points_awarded, 10) || 10;

    const body = {
      semester: form.semester,
      academic_year: form.academic_year,
      winning_house: form.winning_house,
      final_points: points,
      bonus_points_awarded: bonus,
      certificate_issued: form.certificate_issued,
      notes: form.notes || null,
      published: form.published,
    };

    const res = editingId
      ? await fetch("/api/admin/house-of-semester", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        })
      : await fetch("/api/admin/house-of-semester", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save.");
      return;
    }

    setActionMsg(editingId ? "Record updated." : "Record created.");
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    await fetchWinners();
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteWinner(id: number) {
    const res = await fetch("/api/admin/house-of-semester", {
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
    const res = await fetch("/api/admin/house-of-semester", {
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

  function startEdit(w: SemWinner) {
    setEditingId(w.id);
    setForm({
      semester: w.semester,
      academic_year: w.academic_year,
      winning_house: w.winning_house,
      final_points: w.final_points.toString(),
      bonus_points_awarded: w.bonus_points_awarded.toString(),
      certificate_issued: w.certificate_issued,
      notes: w.notes || "",
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
          House of the Semester
        </h1>
        <p className="text-sm text-neutral-400">
          Manage semester recognition records. The winning House receives a
          certificate, public recognition, and +10 bonus points carried to the
          next semester per Article I, Section 9(4).
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
            {loading ? "Loading…" : "Load Records"}
          </button>
        )}
        {fetched && !showForm && (
          <button onClick={startNew} className={btnPrimary}>
            + Record Recognition
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit Record" : "New Recognition Record"}
          </h2>
          <form onSubmit={submitWinner} className="mx-auto max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Semester</label>
                <input
                  value={form.semester}
                  onChange={(e) => updateForm("semester", e.target.value)}
                  required
                  placeholder="First Semester"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Academic Year</label>
                <input
                  value={form.academic_year}
                  onChange={(e) =>
                    updateForm("academic_year", e.target.value)
                  }
                  required
                  placeholder="2025-2026"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Winning House</label>
              <select
                value={form.winning_house}
                onChange={(e) =>
                  updateForm("winning_house", e.target.value)
                }
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
                onChange={(e) =>
                  updateForm("final_points", e.target.value)
                }
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Bonus Points Awarded</label>
              <input
                type="number"
                value={form.bonus_points_awarded}
                onChange={(e) =>
                  updateForm("bonus_points_awarded", e.target.value)
                }
                className={inputCls}
              />
              <p className="mt-1 text-xs text-neutral-500">
                Default is +10 per Article I, Section 9(4).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="form_cert"
                checked={form.certificate_issued}
                onChange={(e) =>
                  updateForm("certificate_issued", e.target.checked)
                }
                className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
              />
              <label htmlFor="form_cert" className="text-sm text-neutral-300">
                Certificate issued
              </label>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                rows={2}
                placeholder="e.g. Highest points in semester history..."
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="form_published"
                checked={form.published}
                onChange={(e) =>
                  updateForm("published", e.target.checked)
                }
                className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
              />
              <label
                htmlFor="form_published"
                className="text-sm text-neutral-300"
              >
                Publish to public page
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

      {/* List */}
      {fetched && winners.length === 0 && (
        <p className="text-sm text-neutral-500">No records yet.</p>
      )}

      {fetched && winners.length > 0 && (
        <div className="space-y-3">
          {winners.map((w) => {
            const color = HOUSE_COLORS[w.winning_house] ?? "#666";
            return (
              <article
                key={w.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {w.winning_house[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {HOUSE_LABELS[w.winning_house]?.replace(
                          "House of ",
                          ""
                        ) ?? w.winning_house}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {w.semester} &middot; {w.academic_year} &middot;{" "}
                        {w.final_points} pts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-900/60 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                      +{w.bonus_points_awarded}
                    </span>
                    {w.published && (
                      <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        published
                      </span>
                    )}
                    {w.certificate_issued && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 text-emerald-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                {w.notes && (
                  <p className="mt-2 text-xs italic text-neutral-500">
                    {w.notes}
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

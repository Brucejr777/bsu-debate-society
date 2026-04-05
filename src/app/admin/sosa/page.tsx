"use client";

import { useState } from "react";

interface SosaReport {
  id: number;
  created_at: string;
  updated_at: string;
  president_name: string;
  semester: string;
  academic_year: string;
  delivered_date: string | null;
  financial_health: string;
  departmental_progress: string;
  house_performance: string;
  presidential_vision: string;
  additional_remarks: string | null;
  status: string;
  is_published: boolean;
}

const SEMESTERS = ["First Semester", "Second Semester"];

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-neutral-800 text-neutral-300",
  final: "bg-blue-900/60 text-blue-300",
  delivered: "bg-emerald-900/60 text-emerald-300",
};

const emptyForm = {
  president_name: "",
  semester: "",
  academic_year: "",
  delivered_date: "",
  financial_health: "",
  departmental_progress: "",
  house_performance: "",
  presidential_vision: "",
  additional_remarks: "",
  status: "draft",
  is_published: false,
};

export default function AdminSosaPage() {
  const [reports, setReports] = useState<SosaReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function fetchReports() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/sosa");
    if (!res.ok) {
      setError("Failed to fetch SOSA reports.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setReports(data);
    setFetched(true);
    setLoading(false);
  }

  async function createReport(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/admin/sosa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setActionMsg("Failed to create SOSA report.");
      return;
    }

    const data = await res.json();
    setReports((prev) => [data, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
    setActionMsg("SOSA report created.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function updateReport(id: number, updates: Partial<SosaReport>) {
    const res = await fetch("/api/admin/sosa", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });

    if (!res.ok) {
      setActionMsg("Failed to update SOSA report.");
      return;
    }

    const data = await res.json();
    setReports((prev) => prev.map((r) => (r.id === id ? data : r)));
    setEditingId(null);
    setActionMsg("SOSA report updated.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteReport(id: number) {
    const res = await fetch("/api/admin/sosa", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      setActionMsg("Failed to delete SOSA report.");
      return;
    }

    setReports((prev) => prev.filter((r) => r.id !== id));
    setActionMsg("SOSA report deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  function startEdit(report: SosaReport) {
    setEditingId(report.id);
    setForm({
      president_name: report.president_name,
      semester: report.semester,
      academic_year: report.academic_year,
      delivered_date: report.delivered_date || "",
      financial_health: report.financial_health,
      departmental_progress: report.departmental_progress,
      house_performance: report.house_performance,
      presidential_vision: report.presidential_vision,
      additional_remarks: report.additional_remarks || "",
      status: report.status,
      is_published: report.is_published,
    });
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const FormFields = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            President Name
          </label>
          <input
            type="text"
            value={form.president_name}
            onChange={(e) => updateField("president_name", e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Academic Year
          </label>
          <input
            type="text"
            value={form.academic_year}
            onChange={(e) => updateField("academic_year", e.target.value)}
            required
            placeholder="2025-2026"
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Semester
          </label>
          <select
            value={form.semester}
            onChange={(e) => updateField("semester", e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          >
            <option value="">Select semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Delivered Date
          </label>
          <input
            type="date"
            value={form.delivered_date}
            onChange={(e) => updateField("delivered_date", e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          Financial Health
        </label>
        <textarea
          value={form.financial_health}
          onChange={(e) => updateField("financial_health", e.target.value)}
          required
          rows={4}
          className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          Departmental Progress
        </label>
        <textarea
          value={form.departmental_progress}
          onChange={(e) => updateField("departmental_progress", e.target.value)}
          required
          rows={4}
          className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          House Performance
        </label>
        <textarea
          value={form.house_performance}
          onChange={(e) => updateField("house_performance", e.target.value)}
          required
          rows={4}
          className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          Presidential Vision
        </label>
        <textarea
          value={form.presidential_vision}
          onChange={(e) => updateField("presidential_vision", e.target.value)}
          required
          rows={4}
          className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          Additional Remarks
        </label>
        <textarea
          value={form.additional_remarks}
          onChange={(e) => updateField("additional_remarks", e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          >
            <option value="draft">Draft</option>
            <option value="final">Final</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div className="flex items-center gap-2 self-end pt-6">
          <input
            type="checkbox"
            id="is_published"
            checked={form.is_published}
            onChange={(e) => updateField("is_published", e.target.checked)}
            className="size-4 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
          />
          <label htmlFor="is_published" className="text-sm text-neutral-300">
            Publish to public archive
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
        >
          {editingId ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          State of the Society Address
        </h1>
        <p className="text-sm text-neutral-400">
          Manage SOSA reports delivered by the President per Constitution Art. 8,
          Sec. 4(i). Published reports appear on the public SOSA archive.
        </p>
      </div>

      {!fetched && (
        <button
          onClick={fetchReports}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Reports"}
        </button>
      )}

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

      {fetched && !showForm && editingId === null && (
        <button
          onClick={startNew}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
        >
          New SOSA Report
        </button>
      )}

      {(showForm || editingId !== null) && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg shadow-black/20">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit SOSA Report" : "New SOSA Report"}
          </h2>
          <form onSubmit={editingId ? undefined : createReport}>
            {editingId !== null ? (
              <>
                <FormFields />
                <button
                  onClick={() => {
                    const report = reports.find((r) => r.id === editingId);
                    if (report) updateReport(editingId, form);
                  }}
                  className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Update
                </button>
              </>
            ) : (
              <FormFields />
            )}
          </form>
        </article>
      )}

      {fetched && reports.length === 0 && (
        <p className="text-sm text-neutral-500">No SOSA reports found.</p>
      )}

      {fetched && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      SOSA — {report.semester} {report.academic_year}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[report.status] ?? "bg-neutral-800 text-neutral-300"}`}
                    >
                      {report.status}
                    </span>
                    {report.is_published && (
                      <span className="rounded-full bg-emerald-900/60 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                        published
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400">
                    {report.president_name}
                    {report.delivered_date && (
                      <>
                        {" "}
                        &middot;{" "}
                        {new Date(report.delivered_date).toLocaleDateString()}
                      </>
                    )}
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-xs text-neutral-500 sm:grid-cols-2">
                    <p>Financial: {report.financial_health.slice(0, 80)}…</p>
                    <p>Houses: {report.house_performance.slice(0, 80)}…</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(report)}
                    className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                  >
                    Edit
                  </button>
                  {!report.is_published && (
                    <button
                      onClick={() =>
                        updateReport(report.id, { is_published: true })
                      }
                      className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                    >
                      Publish
                    </button>
                  )}
                  {report.is_published && (
                    <button
                      onClick={() =>
                        updateReport(report.id, { is_published: false })
                      }
                      className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="rounded-full bg-red-900/60 px-4 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

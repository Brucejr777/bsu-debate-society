"use client";

import { useState, type FormEvent } from "react";

interface Application {
  id: number;
  created_at: string;
  full_name: string;
  student_id: string;
  college: string;
  house_choice: string;
  email: string;
  phone: string | null;
  status: string;
  comments: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

export default function AdminMembershipsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<Record<number, string>>({});

  async function fetchApps() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/memberships");

    if (!res.ok) {
      setError("Failed to fetch applications.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setApps(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: "approved" | "rejected") {
    const note = adminNote[id] ?? null;

    const res = await fetch("/api/admin/memberships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, comments: note }),
    });

    if (!res.ok) {
      setActionMsg("Failed to update application.");
      return;
    }

    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, comments: note } : a))
    );
    setActionMsg(`Application ${status}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-900/60 text-amber-300",
      approved: "bg-emerald-900/60 text-emerald-300",
      rejected: "bg-red-900/60 text-red-300",
    };
    return (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? "bg-neutral-800 text-neutral-300"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Membership Applications
        </h1>
        <p className="text-sm text-neutral-400">
          Review and manage applications per Constitution Article 5. House Councils
          approve new members by majority vote.
        </p>
      </div>

      {/* Fetch Button */}
      {!fetched && (
        <button
          onClick={fetchApps}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Applications"}
        </button>
      )}

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

      {/* Applications List */}
      {fetched && apps.length === 0 && (
        <p className="text-sm text-neutral-500">No applications found.</p>
      )}

      {fetched && apps.length > 0 && (
        <div className="space-y-4">
          {apps.map((app) => {
            const color = HOUSE_COLORS[app.house_choice] ?? "#666";
            return (
              <article
                key={app.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {app.house_choice[0]}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">
                          {app.full_name}
                        </h3>
                        {statusBadge(app.status)}
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-2">
                        <p>Student ID: <span className="text-neutral-300">{app.student_id}</span></p>
                        <p>College: <span className="text-neutral-300">{app.college}</span></p>
                        <p>Email: <span className="text-neutral-300">{app.email}</span></p>
                        {app.phone && <p>Phone: <span className="text-neutral-300">{app.phone}</span></p>}
                        <p>Applied: <span className="text-neutral-300">{new Date(app.created_at).toLocaleDateString()}</span></p>
                      </div>
                      {app.comments && (
                        <p className="text-sm text-neutral-500">
                          Admin note: <span className="text-neutral-400">{app.comments}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {app.status === "pending" && (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <input
                        type="text"
                        placeholder="Admin note…"
                        value={adminNote[app.id] ?? ""}
                        onChange={(e) =>
                          setAdminNote((prev) => ({ ...prev, [app.id]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 sm:w-48"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(app.id, "approved")}
                          className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          className="rounded-full bg-red-800 px-4 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

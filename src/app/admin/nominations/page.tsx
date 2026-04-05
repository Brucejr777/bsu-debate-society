"use client";

import { useState } from "react";

interface Nomination {
  id: number;
  created_at: string;
  nominator_name: string;
  nominator_house: string;
  nominator_email: string | null;
  nominee_name: string;
  nominee_house: string;
  award_category: string;
  tier: string | null;
  justification: string;
  supporting_documentation: string | null;
  semester: string;
  status: string;
  selection_notes: string | null;
}

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  under_review: "bg-blue-900/60 text-blue-300",
  approved: "bg-emerald-900/60 text-emerald-300",
  rejected: "bg-red-900/60 text-red-300",
};

export default function AdminNominationsPage() {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function fetchNominations() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/nominations");
    if (!res.ok) {
      setError("Failed to fetch nominations.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setNominations(data);
    setFetched(true);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const note = notes[id] ?? null;

    const res = await fetch("/api/admin/nominations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, selection_notes: note }),
    });

    if (!res.ok) {
      setActionMsg("Failed to update nomination.");
      return;
    }

    setNominations((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status, selection_notes: note } : n
      )
    );
    setActionMsg(`Nomination marked as ${status.replace("_", " ")}.`);
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function deleteNomination(id: number) {
    const res = await fetch("/api/admin/nominations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      setActionMsg("Failed to delete nomination.");
      return;
    }

    setNominations((prev) => prev.filter((n) => n.id !== id));
    setActionMsg("Nomination deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Individual Recognition Nominations
        </h1>
        <p className="text-sm text-neutral-400">
          Review and manage nominations for Individual Recognition awards. The
          Selection Committee evaluates nominations and assigns recipients per
          Article II of the Rules and Procedures.
        </p>
      </div>

      {!fetched && (
        <button
          onClick={fetchNominations}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Nominations"}
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

      {fetched && nominations.length === 0 && (
        <p className="text-sm text-neutral-500">No nominations found.</p>
      )}

      {fetched && nominations.length > 0 && (
        <div className="space-y-4">
          {nominations.map((nom) => {
            const color = HOUSE_COLORS[nom.nominee_house] ?? "#666";
            const isExpanded = expandedId === nom.id;
            return (
              <article
                key={nom.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {nom.nominee_house[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {nom.nominee_name}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {nom.nominee_house} &middot; {nom.award_category}
                        {nom.tier && <>&middot; {nom.tier}</>}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[nom.status] ?? "bg-neutral-800 text-neutral-300"}`}
                    >
                      {nom.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-3">
                    <p>
                      Nominated by:{" "}
                      <span className="text-neutral-300">
                        {nom.nominator_name} ({nom.nominator_house})
                      </span>
                    </p>
                    <p>
                      Semester:{" "}
                      <span className="text-neutral-300">{nom.semester}</span>
                    </p>
                    <p>
                      Submitted:{" "}
                      <span className="text-neutral-300">
                        {new Date(nom.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  {/* Expand / Collapse */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : nom.id)
                    }
                    className="text-sm font-medium text-neutral-400 transition hover:text-white"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-neutral-800 pt-4">
                      {nom.nominator_email && (
                        <p className="text-sm text-neutral-400">
                          Nominator email:{" "}
                          <span className="text-neutral-300">
                            {nom.nominator_email}
                          </span>
                        </p>
                      )}

                      <div>
                        <p className="text-sm font-medium text-white">
                          Justification
                        </p>
                        <p className="mt-1 text-sm leading-6 text-neutral-300">
                          {nom.justification}
                        </p>
                      </div>

                      {nom.supporting_documentation && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Supporting Documentation
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {nom.supporting_documentation}
                          </p>
                        </div>
                      )}

                      {nom.selection_notes && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Selection Notes
                          </p>
                          <p className="mt-1 text-sm leading-6 text-neutral-300">
                            {nom.selection_notes}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {nom.status !== "approved" &&
                        nom.status !== "rejected" && (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                            <textarea
                              placeholder="Selection notes…"
                              value={notes[nom.id] ?? ""}
                              onChange={(e) =>
                                setNotes((prev) => ({
                                  ...prev,
                                  [nom.id]: e.target.value,
                                }))
                              }
                              rows={2}
                              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(nom.id, "approved")}
                                className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(nom.id, "under_review")
                                }
                                className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                              >
                                Under Review
                              </button>
                              <button
                                onClick={() => updateStatus(nom.id, "rejected")}
                                className="rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-700"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => deleteNomination(nom.id)}
                                className="rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
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

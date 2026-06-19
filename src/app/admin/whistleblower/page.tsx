// src/app/admin/whistleblower/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";

interface WhistleblowerReport {
  id: number;
  created_at: string;
  is_anonymous: boolean;
  contact_method: string | null;
  misconduct_types: string[];
  parties_involved: string | null;
  factual_summary: string;
  supporting_documentation: string | null;
  status: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-900/60 text-amber-300",
  under_review: "bg-blue-900/60 text-blue-300",
  resolved: "bg-emerald-900/60 text-emerald-300",
};

const MISCONDUCT_LABELS: Record<string, string> = {
  constitutional_violation: "Constitutional Violation",
  financial_irregularity: "Financial Irregularity",
  ethical_breach: "Ethical Breach",
  retaliation: "Retaliation / Intimidation",
  safety_threat: "Safety / Institutional Threat",
  other: "Other Misconduct",
};

export default function AdminWhistleblowerPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [reports, setReports] = useState<WhistleblowerReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 1. Fetch current officer profile for RBAC & Delete permissions
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Fetch reports
  async function fetchReports() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/whistleblower");
      if (!res.ok) throw new Error("Failed to fetch reports.");
      const data = await res.json();
      setReports(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to fetch confidential reports.");
    } finally {
      setLoading(false);
    }
  }

  // 3. Update status
  async function updateStatus(id: number, status: string) {
    const previousReports = [...reports];
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    try {
      const res = await fetch("/api/admin/whistleblower", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      toast.success(`Report marked as ${status.replace(/_/g, " ")}.`);
    } catch (err) {
      setReports(previousReports);
      toast.error("Failed to update report status.");
    }
  }

  // 4. Delete report (Strictly President only)
  async function deleteReport(id: number) {
    if (!confirm("Are you sure you want to permanently delete this confidential report? This action cannot be undone.")) return;

    const previousReports = [...reports];
    setReports((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch("/api/admin/whistleblower", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Report permanently deleted.");
    } catch (err) {
      setReports(previousReports);
      toast.error("Failed to delete report.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Constitutional Mandate */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Confidential Whistleblower Reports
          </h1>
          <p className="text-sm text-neutral-400">
            Manage secure disclosures of misconduct, ethical violations, or administrative malfeasance.
          </p>
        </div>

        {/* Strict Confidentiality Banner */}
        <article className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-5 shrink-0 text-red-400">
              <path fillRule="evenodd" d="M10 2a5.5 5.5 0 0 0-5.5 5.5v.75H3.375A2.375 2.375 0 0 0 1 10.625v4.75A2.375 2.375 0 0 0 3.375 17.75h13.25a2.375 2.375 0 0 0 2.375-2.375v-4.75a2.375 2.375 0 0 0-2.375-2.375H15.5V7.5A5.5 5.5 0 0 0 10 2Zm0 2.5a3 3 0 0 1 3 3v.75H7V7.5a3 3 0 0 1 3-3Zm-4.5 6.25h9v4.25a.875.875 0 0 1-.875.875H3.375a.875.875 0 0 1-.875-.875v-4.25Z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-200">
                Strict Confidentiality & Anti-Retaliation Mandate
              </h3>
              <p className="mt-1 text-xs leading-5 text-red-300/80">
                Access to these reports is restricted exclusively to the OIA, Chief Adviser, and President per{" "}
                <strong className="text-white">Constitution Art. 3, Sec. 14</strong> and{" "}
                <strong className="text-white">Rules Art. VI, Sec. 4(6)</strong>. 
                Discloser identities must be protected. Retaliation against any good-faith discloser constitutes a{" "}
                <strong className="text-white">Major Violation</strong> subject to expulsion.
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* RBAC Guard: Blocks OIA, Chief Adviser, President fallback */}
      <RBACGuard 
        officer={officer} 
        checkPermission={(o) => RBAC.canViewWhistleblower(o.role as Role)}
      >
        {/* Load Button */}
        {!fetched && (
          <button
            onClick={fetchReports}
            disabled={loading}
            className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Loading Secure Files…" : "Load Confidential Reports"}
          </button>
        )}

        {/* Empty State */}
        {fetched && reports.length === 0 && (
          <p className="text-sm text-neutral-500">No whistleblower reports currently on file.</p>
        )}

        {/* Reports List */}
        {fetched && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => {
              const isExpanded = expandedId === report.id;
              
              return (
                <article
                  key={report.id}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg"
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-400">
                        <path fillRule="evenodd" d="M10 2a5.5 5.5 0 0 0-5.5 5.5v.75H3.375A2.375 2.375 0 0 0 1 10.625v4.75A2.375 2.375 0 0 0 3.375 17.75h13.25a2.375 2.375 0 0 0 2.375-2.375v-4.75a2.375 2.375 0 0 0-2.375-2.375H15.5V7.5A5.5 5.5 0 0 0 10 2Zm0 2.5a3 3 0 0 1 3 3v.75H7V7.5a3 3 0 0 1 3-3Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">
                        {report.is_anonymous ? "Anonymous Discloser" : "Identified Discloser"}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Filed: {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        STATUS_BADGE[report.status] ?? "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {report.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Misconduct Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {report.misconduct_types.map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-400"
                      >
                        {MISCONDUCT_LABELS[type] ?? type.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>

                  {/* Expand / Collapse */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : report.id)}
                    className="mt-4 text-sm font-medium text-neutral-400 transition hover:text-white"
                  >
                    {isExpanded ? "Hide details" : "View full report"}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                      {/* Contact Method (If not anonymous) */}
                      {!report.is_anonymous && report.contact_method && (
                        <div>
                          <p className="text-xs font-medium text-white">Secure Contact Method</p>
                          <p className="mt-1 text-sm text-neutral-300">{report.contact_method}</p>
                        </div>
                      )}

                      {/* Parties Involved */}
                      {report.parties_involved && (
                        <div>
                          <p className="text-xs font-medium text-white">Parties Involved</p>
                          <p className="mt-1 text-sm text-neutral-300">{report.parties_involved}</p>
                        </div>
                      )}

                      {/* Factual Summary */}
                      <div>
                        <p className="text-xs font-medium text-white">Factual Summary</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                          {report.factual_summary}
                        </p>
                      </div>

                      {/* Supporting Documentation */}
                      {report.supporting_documentation && (
                        <div>
                          <p className="text-xs font-medium text-white">Supporting Documentation</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                            {report.supporting_documentation}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
                        {report.status !== "under_review" && (
                          <button
                            onClick={() => updateStatus(report.id, "under_review")}
                            className="rounded-full bg-blue-800 px-4 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                          >
                            Mark Under Review
                          </button>
                        )}
                        {report.status !== "resolved" && (
                          <button
                            onClick={() => updateStatus(report.id, "resolved")}
                            className="rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-700"
                          >
                            Mark Resolved
                          </button>
                        )}
                        
                        {/* DELETE ACTION: STRICTLY PRESIDENT ONLY */}
                        {officer && officer.role === Role.PRESIDENT && (
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="ml-auto rounded-full bg-red-900/60 px-4 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900"
                          >
                            Permanently Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </RBACGuard>
    </div>
  );
}
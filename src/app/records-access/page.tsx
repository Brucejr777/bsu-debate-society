"use client";

import { useState, type FormEvent } from "react";
import { HOUSES } from "@/lib/houses";

const VALID_HOUSES = HOUSES.map((h) => h.value);

const CLASSIFICATIONS = [
  { value: "public", label: "Public Records", desc: "Minutes, point standings, budgets, election results, final disciplinary decisions, governing documents" },
  { value: "restricted", label: "Restricted Records", desc: "Draft minutes, individual member data, internal deliberation notes, complaint forms, financial records with personal details" },
];

const FORMATS = ["Digital copy", "In-person review", "Summary"];

const SCOPES = ["Society-wide", "House-level"];

export default function RecordsAccessPage() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const requesterName = fd.get("requester_name") as string;
    const requesterHouse = fd.get("requester_house") as string;
    const requesterEmail = fd.get("requester_email") as string;
    const classification = fd.get("records_classification") as string;
    const recordsSought = fd.get("specific_records_sought") as string;
    const purpose = fd.get("purpose") as string;
    const format = fd.get("preferred_format") as string;
    const scope = fd.get("scope") as string;
    const notes = (fd.get("additional_notes") as string) || null;

    if (!requesterName || !requesterHouse || !requesterEmail || !classification || !recordsSought || !purpose || !format || !scope) {
      setStatus({ type: "error", message: "All required fields must be filled." });
      setPending(false);
      return;
    }

    if (!VALID_HOUSES.includes(requesterHouse)) {
      setStatus({ type: "error", message: "Please select a valid House." });
      setPending(false);
      return;
    }

    const res = await fetch("/api/records-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester_name: requesterName,
        requester_house: requesterHouse,
        requester_email: requesterEmail,
        records_classification: classification,
        specific_records_sought: recordsSought,
        purpose,
        preferred_format: format,
        scope,
        additional_notes: notes,
      }),
    });

    if (!res.ok) {
      setStatus({ type: "error", message: "Failed to submit request. Please try again." });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Access request submitted successfully. The Executive Secretary (for Society-wide records) or relevant House Secretariat Director will process your request within ten (10) working days.",
    });
    form.reset();
    setPending(false);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back */}
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Rules &amp; Procedures — Article VIII, Section 4
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Records Access Request
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Any active member may request access to Public or Restricted
              Records by submitting a written Access Request Form to the
              Executive Secretary (for Society-wide records) or relevant House
              Secretariat Director (for House-level records). The form must
              include the requester&apos;s name and House, specific records
              sought, purpose of request, and preferred format.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Article VIII, Section 4(1)
            </p>
          </article>

          {/* Record Classifications */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CLASSIFICATIONS.map((c) => (
              <article key={c.value} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <h3 className="text-base font-semibold text-white">
                  {c.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {c.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Access Methods */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">
                Access Methods
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-sm font-semibold text-white">Digital Access</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Public Records posted on the Society&apos;s platform with view-only permissions. Restricted Records shared via secure delivery.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-sm font-semibold text-white">Physical Access</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Records available for in-person review at the Office of the Executive Secretary during regular hours.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-sm font-semibold text-white">No Fees</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    No fee for Public Records access. Reasonable copying costs may apply for physical copies of Restricted Records.
                  </p>
                </div>
              </div>
              <p className="text-xs italic text-neutral-500">
                — Article VIII, Section 4(3) &amp; Section 4(4)
              </p>
            </div>
          </article>

          {/* Form */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Access Request Form
                </h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with <span className="text-red-400">*</span> are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="requester_name" className="block text-sm font-medium text-neutral-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" id="requester_name" name="requester_name" placeholder="Juan dela Cruz" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* House */}
                <div className="space-y-2">
                  <label htmlFor="requester_house" className="block text-sm font-medium text-neutral-300">
                    House <span className="text-red-400">*</span>
                  </label>
                  <select id="requester_house" name="requester_house" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                    <option value="" disabled>Select your House</option>
                    {HOUSES.map((h) => (<option key={h.value} value={h.value}>{h.name}</option>))}
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="requester_email" className="block text-sm font-medium text-neutral-300">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input type="email" id="requester_email" name="requester_email" placeholder="juan@bsu.edu.ph" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Classification */}
                <div className="space-y-2">
                  <label htmlFor="records_classification" className="block text-sm font-medium text-neutral-300">
                    Records Classification <span className="text-red-400">*</span>
                  </label>
                  <select id="records_classification" name="records_classification" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                    <option value="" disabled>Select classification</option>
                    {CLASSIFICATIONS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                  </select>
                </div>

                {/* Scope */}
                <div className="space-y-2">
                  <label htmlFor="scope" className="block text-sm font-medium text-neutral-300">
                    Record Scope <span className="text-red-400">*</span>
                  </label>
                  <select id="scope" name="scope" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                    <option value="" disabled>Select scope</option>
                    {SCOPES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>

                {/* Specific Records */}
                <div className="space-y-2">
                  <label htmlFor="specific_records_sought" className="block text-sm font-medium text-neutral-300">
                    Specific Records Sought <span className="text-red-400">*</span>
                  </label>
                  <textarea id="specific_records_sought" name="specific_records_sought" rows={4} required placeholder="e.g. Approved minutes of the Second Semester House Assembly, finalized House Point System standings for 2025-2026..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <label htmlFor="purpose" className="block text-sm font-medium text-neutral-300">
                    Purpose of Request <span className="text-red-400">*</span>
                  </label>
                  <textarea id="purpose" name="purpose" rows={3} required placeholder="e.g. Research for House activity report, personal reference, academic study..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Preferred Format */}
                <div className="space-y-2">
                  <label htmlFor="preferred_format" className="block text-sm font-medium text-neutral-300">
                    Preferred Format <span className="text-red-400">*</span>
                  </label>
                  <select id="preferred_format" name="preferred_format" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                    <option value="" disabled>Select format</option>
                    {FORMATS.map((f) => (<option key={f} value={f}>{f}</option>))}
                  </select>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label htmlFor="additional_notes" className="block text-sm font-medium text-neutral-300">
                    Additional Notes <span className="text-neutral-500">(optional)</span>
                  </label>
                  <textarea id="additional_notes" name="additional_notes" rows={2} placeholder="Any other details to clarify your request..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Submit */}
                <button type="submit" disabled={pending} className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50">
                  {pending ? "Submitting…" : "Submit Access Request"}
                </button>

                {/* Feedback */}
                {status && (
                  <div className={`rounded-xl border px-4 py-3 text-sm ${status.type === "success" ? "border-emerald-800 bg-emerald-950/50 text-emerald-400" : "border-red-800 bg-red-950/50 text-red-400"}`}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>
          </article>

          {/* Processing Timeline */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-neutral-400">
                The Executive Secretary or relevant House Secretariat Director
                shall process requests within ten (10) working days. If the
                request involves Restricted Records, the custodian may require
                additional verification or redactions before granting access.
                No fee shall be charged for Public Records access; reasonable
                copying costs may apply for physical copies of Restricted
                Records. If your request is denied, you may appeal within five
                (5) calendar days.
              </p>
              <a
                href="/appeals"
                className="inline-flex items-center text-sm font-medium text-neutral-400 transition hover:text-white"
              >
                Appeal a Denial
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1.5 size-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </a>
              <p className="text-xs italic text-neutral-500">
                — Article VIII, Section 4 &amp; Section 6
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

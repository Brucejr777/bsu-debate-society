"use client";

import { useState, type FormEvent } from "react";
import { HOUSES } from "@/lib/houses";

const TOURNAMENT_LEVELS = [
  "International",
  "National",
  "Regional",
  "Local / Inter-School",
];

const SUPPORT_TYPES = [
  "Official endorsement letter",
  "Access to case library",
  "Coordination assistance",
  "Priority access to pre-tournament workshops",
  "Mentorship from senior members/alumni",
  "Reimbursement or advance for fees, transport, accommodation",
];

export default function SupportRequestPage() {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const memberName = formData.get("member_name") as string;
    const memberHouse = formData.get("member_house") as string;
    const memberEmail = formData.get("member_email") as string;
    const tournamentName = formData.get("tournament_name") as string;
    const tournamentDate = formData.get("tournament_date") as string;
    const tournamentLevel = formData.get("tournament_level") as string;
    const tournamentLocation =
      (formData.get("tournament_location") as string) || null;
    const role = (formData.get("role_in_tournament") as string) || "debater";
    const requestedSupport = formData.get("requested_support") as string;
    const estimatedCost = (formData.get("estimated_cost") as string) || null;
    const deadlineMet = formData.get("submission_deadline_met") === "on";

    if (
      !memberName ||
      !memberHouse ||
      !memberEmail ||
      !tournamentName ||
      !tournamentDate ||
      !tournamentLevel ||
      !requestedSupport
    ) {
      setStatus({
        type: "error",
        message: "All required fields must be filled.",
      });
      setPending(false);
      return;
    }

    if (new Date(tournamentDate) < new Date()) {
      setStatus({
        type: "error",
        message: "Tournament date must be in the future.",
      });
      setPending(false);
      return;
    }

    const res = await fetch("/api/support-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_name: memberName,
        member_house: memberHouse,
        member_email: memberEmail,
        tournament_name: tournamentName,
        tournament_date: tournamentDate,
        tournament_level: tournamentLevel,
        tournament_location: tournamentLocation,
        role_in_tournament: role,
        requested_support: requestedSupport,
        estimated_cost: estimatedCost,
        submission_deadline_met: deadlineMet,
      }),
    });

    if (!res.ok) {
      setStatus({
        type: "error",
        message: "Failed to submit request. Please try again.",
      });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Support request submitted successfully. The High Council will review your request and respond with a decision.",
    });
    form.reset();
    setPending(false);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/league"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
              Back to League
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Rules &amp; Procedures — Article III, Section 4
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Request League Support
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Members of the Debate League registered for external tournaments
              representing BSU are eligible for institutional support, including
              official endorsement, access to the case library, coordination
              assistance, priority workshop access, mentorship, and reimbursement
              or advance for tournament expenses.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article III, Section 4
            </p>
          </article>

          {/* What's Covered */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="space-y-4">
              <h2 className="text-center text-xl font-semibold text-white">
                Support Provided by the Society
              </h2>
              <ul className="space-y-2">
                {SUPPORT_TYPES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs italic text-neutral-500">
                — Article III, Section 4(a)–(f)
              </p>
            </div>
          </article>

          {/* Eligibility & Requirements */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold text-white">Eligibility</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Must be a registered Debate League member
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Tournament must be recognized by the High Council
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Request must be submitted at least 7 days before the tournament
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Post-tournament report required within 7 days of conclusion
                </li>
              </ul>
            </article>

            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold text-white">
                Prioritization
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                When resources are limited, the High Council prioritizes by:
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Tournament prestige and relevance
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Member&apos;s standing in the Debate League
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-600" />
                  Reasonableness and necessity of the request
                </li>
              </ul>
            </article>
          </div>

          {/* Support Request Form */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Request for Support Form
                </h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with{" "}
                  <span className="text-red-400">*</span> are required. Your
                  request will be reviewed by the High Council.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Member Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="member_name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="member_name"
                    name="member_name"
                    placeholder="Juan dela Cruz"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Member House */}
                <div className="space-y-2">
                  <label
                    htmlFor="member_house"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    House <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="member_house"
                    name="member_house"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select your House
                    </option>
                    {HOUSES.map((house) => (
                      <option key={house.value} value={house.value}>
                        {house.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Member Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="member_email"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="member_email"
                    name="member_email"
                    placeholder="juan@bsu.edu.ph"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Tournament Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="tournament_name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Tournament Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="tournament_name"
                    name="tournament_name"
                    placeholder="e.g. Asian British Parliamentary Championship"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Tournament Date */}
                <div className="space-y-2">
                  <label
                    htmlFor="tournament_date"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Tournament Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    id="tournament_date"
                    name="tournament_date"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Tournament Level */}
                <div className="space-y-2">
                  <label
                    htmlFor="tournament_level"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Tournament Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="tournament_level"
                    name="tournament_level"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select level
                    </option>
                    {TOURNAMENT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tournament Location */}
                <div className="space-y-2">
                  <label
                    htmlFor="tournament_location"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Location{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="tournament_location"
                    name="tournament_location"
                    placeholder="e.g. Manila, Philippines"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label
                    htmlFor="role_in_tournament"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Your Role
                  </label>
                  <select
                    id="role_in_tournament"
                    name="role_in_tournament"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="debater">Debater</option>
                    <option value="coach">Coach / Trainer</option>
                    <option value="observer">Observer / Adjudicator</option>
                  </select>
                </div>

                {/* Requested Support */}
                <div className="space-y-2">
                  <label
                    htmlFor="requested_support"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Requested Support{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="requested_support"
                    name="requested_support"
                    rows={5}
                    required
                    placeholder="Describe the support you are requesting: official endorsement letter, case library access, coordination assistance, mentorship, reimbursement/advance for fees, transport, accommodation, etc. Be specific about your anticipated needs..."
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Estimated Cost */}
                <div className="space-y-2">
                  <label
                    htmlFor="estimated_cost"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Estimated Cost (₱){" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="number"
                    id="estimated_cost"
                    name="estimated_cost"
                    placeholder="5000"
                    min="0"
                    step="100"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Deadline Acknowledgment */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="submission_deadline_met"
                    name="submission_deadline_met"
                    className="mt-1 size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 text-neutral-950 accent-neutral-500"
                  />
                  <label
                    htmlFor="submission_deadline_met"
                    className="text-sm text-neutral-400"
                  >
                    I confirm this request is being submitted at least seven (7)
                    days before the tournament date, as required by Article III,
                    Section 4.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Submitting…" : "Submit Support Request"}
                </button>

                {/* Feedback */}
                {status && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      status.type === "success"
                        ? "border-emerald-800 bg-emerald-950/50 text-emerald-400"
                        : "border-red-800 bg-red-950/50 text-red-400"
                    }`}
                  >
                    {status.message}
                  </div>
                )}
              </form>
            </div>
          </article>

          {/* Post-Tournament Notice */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-neutral-400">
                Recipients of Society support are required to submit a
                post-tournament report within seven (7) calendar days of the
                tournament&apos;s conclusion. The report should include results,
                key learnings, and an itemized accounting of all expenses covered
                by the Society. Failure to submit may affect eligibility for
                future support requests.
              </p>
              <p className="text-xs italic text-neutral-500">
                — Article III, Section 4
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

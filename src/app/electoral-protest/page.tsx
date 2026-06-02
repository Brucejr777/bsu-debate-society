"use client";
import { useState, type FormEvent } from "react";
import { HOUSES } from "@/lib/houses";

const VALID_HOUSES = HOUSES.map((h) => h.value);

const PROTEST_GROUNDS = [
  { value: "procedural_violation", label: "Procedural Violation", desc: "Violation of established election procedures, timelines, or protocols during the Presidential Conclave" },
  { value: "vote_tampering", label: "Vote Tampering", desc: "Manipulation, alteration, or improper handling of ballots, vote counts, or election records" },
  { value: "eligibility_issues", label: "Eligibility Issues", desc: "Questions regarding the eligibility of candidates, electors, or participants in the Conclave" },
];

export default function ElectoralProtestPage() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const protestantName = fd.get("protestant_name") as string;
    const protestantHouse = fd.get("protestant_house") as string;
    const protestantEmail = (fd.get("protestant_email") as string) || null;
    const protestGround = fd.get("protest_ground") as string;
    const specificViolations = fd.get("specific_violations") as string;
    const evidenceSummary = fd.get("evidence_summary") as string;
    const requestedRelief = fd.get("requested_relief") as string;
    const witnesses = (fd.get("witnesses") as string) || null;
    const proclamationDate = fd.get("proclamation_date") as string;

    if (!protestantName || !protestantHouse || !protestGround || !specificViolations || !evidenceSummary || !requestedRelief || !proclamationDate) {
      setStatus({ type: "error", message: "All required fields must be filled." });
      setPending(false);
      return;
    }

    if (!VALID_HOUSES.includes(protestantHouse)) {
      setStatus({ type: "error", message: "Please select a valid House." });
      setPending(false);
      return;
    }

    const res = await fetch("/api/electoral-protest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        protestant_name: protestantName,
        protestant_house: protestantHouse,
        protestant_email: protestantEmail,
        protest_ground: protestGround,
        specific_violations: specificViolations,
        evidence_summary: evidenceSummary,
        requested_relief: requestedRelief,
        witnesses,
        proclamation_date: proclamationDate,
        filed_within_deadline: true,
      }),
    });

    if (!res.ok) {
      setStatus({ type: "error", message: "Failed to file protest. Please try again." });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Electoral protest filed successfully. The protest will be adjudicated by the High Tribunal, presided over by the Society Chief Adviser. The decision of the Tribunal shall be final and executory.",
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
              Rules &amp; Procedures — Article VII, Sections 6 &amp; 10
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Electoral Protest &amp; Contingencies
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Any House Chancellor may file an electoral protest within <strong className="text-white">three (3) days</strong> of
              the Proclamation on grounds of procedural violation, vote tampering, or eligibility issues.
              Electoral protests are adjudicated by the High Tribunal, presided over by the Society Chief Adviser.
              The decision of the Tribunal is <strong className="text-white">final and executory</strong>.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article VII, Section 10
            </p>
          </article>

          {/* Protest Grounds */}
          <div className="space-y-4">
            {PROTEST_GROUNDS.map((g) => (
              <article key={g.value} className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-300">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 9 9Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{g.label}</h3>
                    <p className="text-xs text-neutral-400">{g.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Process */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">
                Adjudication Process
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-sm font-semibold text-white">1. Filing</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Protest filed within 3 days of Proclamation by a House Chancellor.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-sm font-semibold text-white">2. Tribunal Hearing</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    High Tribunal adjudicates, presided by the Society Chief Adviser.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <p className="text-sm font-semibold text-white">3. Final Verdict</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Decision is final and executory. If nullified, new Conclave within 14 days.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* ═══════════════════════════════════════ */}
          {/* CONTINGENCY & SUBSTITUTION PROCEDURES   */}
          {/* ═══════════════════════════════════════ */}
          <article className="rounded-3xl border border-purple-900/40 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-purple-200">
                Contingency &amp; Substitution Procedures
              </h2>
              <p className="text-sm italic text-neutral-500">
                — Article VII, Section 6
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {/* Grounds for Substitution */}
              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
                <h3 className="text-lg font-semibold text-amber-200">Grounds for Substitution</h3>
                <p className="mt-2 text-sm leading-6 text-amber-300/80">
                  A House Chancellor-candidate may be substituted if they are unable to continue, are ineligible, or cannot assume the Presidency due to:
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-neutral-300">
                  <li>• Voluntary withdrawal or resignation filed in writing</li>
                  <li>• Disqualification due to ineligibility discovered mid-process</li>
                  <li>• Incapacity (health emergency, university sanction, or force majeure)</li>
                  <li>• Death or permanent inability to serve</li>
                  <li>• Graduating Status (not enrolled for the subsequent academic year, unless permitted by High Council Resolution)</li>
                </ul>
              </div>

              {/* Succession Hierarchy */}
              <div className="rounded-2xl border border-blue-900/40 bg-neutral-900/60 p-5">
                <h3 className="text-lg font-semibold text-blue-200">Succession Hierarchy</h3>
                <p className="mt-2 text-sm text-neutral-400">The House Council has a strict timeframe to identify a substitute from within its ranks:</p>
                <ol className="mt-3 space-y-2 text-sm text-neutral-300 list-decimal list-inside">
                  <li><strong className="text-white">House Vice Chancellor</strong> (provided they meet constitutional qualifications)</li>
                  <li><strong className="text-white">House Council Director</strong> (e.g., Secretariat, Internal Affairs, External Affairs, Finance)</li>
                  <li><strong className="text-white">Special Nomination Assembly</strong> (if all officers are ineligible, an assembly of all bona fide Full Members of the House convenes to nominate and elect a substitute by majority vote)</li>
                </ol>
              </div>

              {/* Timeline Procedures */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <h4 className="text-sm font-semibold text-emerald-300">Pre-Conclave</h4>
                  <p className="mt-2 text-xs text-neutral-400">House Council has <strong className="text-white">48 hours</strong> to appoint a substitute. Failure results in a vacant seat for the Conclave.</p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <h4 className="text-sm font-semibold text-amber-300">During Conclave</h4>
                  <p className="mt-2 text-xs text-neutral-400">Conclave suspends. House Council has <strong className="text-white">24 hours</strong> to appoint. Failure results in a vacant seat.</p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <h4 className="text-sm font-semibold text-red-300">Post-Election</h4>
                  <p className="mt-2 text-xs text-neutral-400">Proclamation held in abeyance. A new Conclave is convened within <strong className="text-white">7 days</strong> with remaining eligible Chancellors.</p>
                </div>
              </div>

              {/* Insufficient Quorum & Extreme Contingencies */}
              <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
                <h3 className="text-lg font-semibold text-red-200">Insufficient Quorum &amp; Extreme Contingencies</h3>
                <div className="mt-3 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-white">3 or 4 Eligible Chancellors</p>
                    <p className="text-xs text-neutral-400">Conclave proceeds normally. The Proceed Vote threshold reduces to two (2) affirmative votes.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">2 or Fewer Eligible Chancellors</p>
                    <p className="text-xs text-neutral-400">Conclave is deemed unable to convene. The election process terminates immediately.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Vice Presidential Succession</p>
                    <p className="text-xs text-neutral-400">If the Conclave cannot convene, the Society Vice President assumes the Presidency (if eligible and the outgoing President cannot continue).</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Period of Discontinuation &amp; Alumni Convention</p>
                    <p className="text-xs text-neutral-400">If the VP is ineligible, the Society enters a <strong className="text-white">Period of Discontinuation</strong>. The Chief Adviser convenes an Alumni Convention within thirty (30) days to elect an Interim President by secret ballot.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Form */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Electoral Protest Form
                </h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with <span className="text-red-400">*</span> are required. Only House Chancellors may file electoral protests.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="protestant_name" className="block text-sm font-medium text-neutral-300">
                    House Chancellor Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" id="protestant_name" name="protestant_name" placeholder="Juan dela Cruz" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* House */}
                <div className="space-y-2">
                  <label htmlFor="protestant_house" className="block text-sm font-medium text-neutral-300">
                    House Represented <span className="text-red-400">*</span>
                  </label>
                  <select id="protestant_house" name="protestant_house" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                    <option value="" disabled>Select your House</option>
                    {HOUSES.map((h) => (
                      <option key={h.value} value={h.value}>{h.name}</option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="protestant_email" className="block text-sm font-medium text-neutral-300">
                    Email Address <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input type="email" id="protestant_email" name="protestant_email" placeholder="chancellor@bsu.edu.ph" className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Protest Ground */}
                <div className="space-y-2">
                  <label htmlFor="protest_ground" className="block text-sm font-medium text-neutral-300">
                    Ground for Protest <span className="text-red-400">*</span>
                  </label>
                  <select id="protest_ground" name="protest_ground" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                    <option value="" disabled>Select ground</option>
                    {PROTEST_GROUNDS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Proclamation Date */}
                <div className="space-y-2">
                  <label htmlFor="proclamation_date" className="block text-sm font-medium text-neutral-300">
                    Date of Proclamation <span className="text-red-400">*</span>
                  </label>
                  <input type="date" id="proclamation_date" name="proclamation_date" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Specific Violations */}
                <div className="space-y-2">
                  <label htmlFor="specific_violations" className="block text-sm font-medium text-neutral-300">
                    Specific Violations Alleged <span className="text-red-400">*</span>
                  </label>
                  <textarea id="specific_violations" name="specific_violations" rows={5} required placeholder="Describe in detail the specific procedural violations, vote tampering incidents, or eligibility issues that are the basis of this protest. Reference the relevant sections of Article VII (Presidential Conclave)..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Evidence Summary */}
                <div className="space-y-2">
                  <label htmlFor="evidence_summary" className="block text-sm font-medium text-neutral-300">
                    Summary of Evidence <span className="text-red-400">*</span>
                  </label>
                  <textarea id="evidence_summary" name="evidence_summary" rows={4} required placeholder="List and describe the evidence supporting this protest: documents, testimonies, records, communications, or other materials..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Requested Relief */}
                <div className="space-y-2">
                  <label htmlFor="requested_relief" className="block text-sm font-medium text-neutral-300">
                    Requested Relief <span className="text-red-400">*</span>
                  </label>
                  <textarea id="requested_relief" name="requested_relief" rows={3} required placeholder="Specify the relief sought from the High Tribunal: nullification of election results, recount, disqualification of candidate, new Conclave, or other remedies..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Witnesses */}
                <div className="space-y-2">
                  <label htmlFor="witnesses" className="block text-sm font-medium text-neutral-300">
                    Witnesses <span className="text-neutral-500">(optional)</span>
                  </label>
                  <textarea id="witnesses" name="witnesses" rows={2} placeholder="Names and contact information of any witnesses to the alleged violations..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                </div>

                {/* Submit */}
                <button type="submit" disabled={pending} className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50">
                  {pending ? "Filing…" : "File Electoral Protest"}
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

          {/* Deadline Notice */}
          <article className="rounded-3xl border border-amber-900/60 bg-amber-950/30 p-6 shadow-lg">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-amber-300">
                <strong>Deadline:</strong> Electoral protests must be filed within
                <strong> three (3) calendar days</strong> of the Proclamation. Protests
                filed after this deadline may be dismissed on procedural grounds.
              </p>
              <p className="text-xs italic text-amber-500/80">
                — Article VII, Section 10(1)
              </p>
            </div>
          </article>

          {/* Recall Notice */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-neutral-400">
                In the event that the election is nullified by the High Tribunal, a
                new Presidential Conclave shall be convened within fourteen (14) days
                following the same procedures outlined in Article VII.
              </p>
              <p className="text-xs italic text-neutral-500">
                — Article VII, Section 10(3)
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
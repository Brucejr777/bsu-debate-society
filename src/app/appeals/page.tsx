"use client";

import { useState, type FormEvent } from "react";
import { HOUSES } from "@/lib/houses";

const VALID_HOUSES = HOUSES.map((h) => h.value);

const APPEAL_TYPES = [
  {
    value: "point_dispute",
    label: "Point Dispute Appeal",
    desc: "Appeal of a final point transaction on grounds of constitutional rights violation (Article I, Section 8)",
    grounds: [
      "Violation of right to information (Art. 4, Sec. 5)",
      "Violation of right to petition (Art. 4, Sec. 4)",
      "Violation of right to due process (Art. 4, Sec. 11)",
      "Violation of right against exploitation (Art. 4, Sec. 7)",
      "Other constitutional rights violation",
    ],
  },
  {
    value: "records_access",
    label: "Records Access Denial Appeal",
    desc: "Appeal of a records access denial or classification decision (Article VIII, Section 6)",
    grounds: [
      "Misclassification of a record",
      "Unreasonable delay in processing",
      "Over-redaction of a Public Record",
      "Violation of constitutional information rights (Art. 4, Sec. 5)",
    ],
  },
];

export default function AppealsPage() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const appealType = fd.get("appeal_type") as string;
    const appellantName = fd.get("appellant_name") as string;
    const appellantHouse = fd.get("appellant_house") as string;
    const appellantEmail = (fd.get("appellant_email") as string) || null;
    const appealGround = fd.get("appeal_ground") as string;
    const statementOfAppeal = fd.get("statement_of_appeal") as string;
    const supportingEvidence = (fd.get("supporting_evidence") as string) || null;
    const requestedRelief = fd.get("requested_relief") as string;

    if (!appealType || !appellantName || !appellantHouse || !appealGround || !statementOfAppeal || !requestedRelief) {
      setStatus({ type: "error", message: "All required fields must be filled." });
      setPending(false);
      return;
    }

    if (!VALID_HOUSES.includes(appellantHouse)) {
      setStatus({ type: "error", message: "Please select a valid House." });
      setPending(false);
      return;
    }

    const body: Record<string, unknown> = {
      appeal_type: appealType,
      appellant_name: appellantName,
      appellant_house: appellantHouse,
      appellant_email: appellantEmail,
      appeal_ground: appealGround,
      statement_of_appeal: statementOfAppeal,
      supporting_evidence: supportingEvidence,
      requested_relief: requestedRelief,
    };

    // Point dispute specific fields
    if (appealType === "point_dispute") {
      body.disputed_transaction_id = (fd.get("disputed_transaction_id") as string) || null;
      body.disputed_transaction_date = (fd.get("disputed_transaction_date") as string) || null;
      body.constitutional_ground = (fd.get("constitutional_ground") as string) || null;
    }

    // Records access appeal specific fields
    if (appealType === "records_access") {
      body.denied_request_id = (fd.get("denied_request_id") as string) || null;
      body.denial_reason = (fd.get("denial_reason") as string) || null;
    }

    const res = await fetch("/api/appeals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setStatus({ type: "error", message: "Failed to file appeal. Please try again." });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Appeal filed successfully. The appropriate adjudicating body will review your appeal and render a decision within the prescribed period.",
    });
    form.reset();
    setSelectedType("");
    setPending(false);
  }

  const selected = APPEAL_TYPES.find((a) => a.value === selectedType);

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
              Rules &amp; Procedures — Articles I &amp; VIII
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              File an Appeal
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Members may file formal appeals regarding point dispute decisions or
              records access denials. Appeals must be submitted in writing and
              will be reviewed by the appropriate adjudicating body within the
              prescribed period.
            </p>
          </article>

          {/* Appeal Types */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {APPEAL_TYPES.map((at) => (
              <article
                key={at.value}
                onClick={() => setSelectedType(at.value)}
                className={`cursor-pointer rounded-3xl border p-6 shadow-lg transition-all ${
                  selectedType === at.value
                    ? "border-emerald-700 bg-emerald-950/30"
                    : "border-neutral-800 bg-neutral-950/95 hover:border-neutral-700"
                }`}
              >
                <h3 className="text-base font-semibold text-white">{at.label}</h3>
                <p className="mt-2 text-sm text-neutral-400">{at.desc}</p>
                <div className="mt-3 space-y-1">
                  {at.grounds.map((g) => (
                    <p key={g} className="text-xs text-neutral-500">• {g}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Form */}
          {selectedType && (
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <div className="mx-auto max-w-xl space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-white">
                    {selected?.label}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    All fields marked with <span className="text-red-400">*</span> are required.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="appeal_type" value={selectedType} />

                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="appellant_name" className="block text-sm font-medium text-neutral-300">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" id="appellant_name" name="appellant_name" placeholder="Juan dela Cruz" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                  </div>

                  {/* House */}
                  <div className="space-y-2">
                    <label htmlFor="appellant_house" className="block text-sm font-medium text-neutral-300">
                      House <span className="text-red-400">*</span>
                    </label>
                    <select id="appellant_house" name="appellant_house" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                      <option value="" disabled>Select your House</option>
                      {HOUSES.map((h) => (<option key={h.value} value={h.value}>{h.name}</option>))}
                    </select>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="appellant_email" className="block text-sm font-medium text-neutral-300">
                      Email Address <span className="text-neutral-500">(optional)</span>
                    </label>
                    <input type="email" id="appellant_email" name="appellant_email" placeholder="juan@bsu.edu.ph" className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                  </div>

                  {/* Point Dispute Specific Fields */}
                  {selectedType === "point_dispute" && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="disputed_transaction_date" className="block text-sm font-medium text-neutral-300">
                          Date of Disputed Transaction <span className="text-red-400">*</span>
                        </label>
                        <input type="date" id="disputed_transaction_date" name="disputed_transaction_date" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="disputed_transaction_id" className="block text-sm font-medium text-neutral-300">
                          Transaction ID / Reference <span className="text-neutral-500">(if available)</span>
                        </label>
                        <input type="text" id="disputed_transaction_id" name="disputed_transaction_id" placeholder="e.g. Transaction #123 or ledger entry reference" className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="constitutional_ground" className="block text-sm font-medium text-neutral-300">
                          Constitutional Ground <span className="text-red-400">*</span>
                        </label>
                        <select id="constitutional_ground" name="constitutional_ground" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                          <option value="" disabled>Select constitutional ground</option>
                          {selected?.grounds.map((g) => (<option key={g} value={g}>{g}</option>))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Records Access Specific Fields */}
                  {selectedType === "records_access" && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="denial_reason" className="block text-sm font-medium text-neutral-300">
                          Appeal Ground <span className="text-red-400">*</span>
                        </label>
                        <select id="denial_reason" name="denial_reason" required className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500">
                          <option value="" disabled>Select ground</option>
                          {selected?.grounds.map((g) => (<option key={g} value={g}>{g}</option>))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="denied_request_id" className="block text-sm font-medium text-neutral-300">
                          Original Request ID / Reference <span className="text-neutral-500">(if available)</span>
                        </label>
                        <input type="text" id="denied_request_id" name="denied_request_id" placeholder="e.g. Access Request #45 or date of original request" className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                      </div>
                    </>
                  )}

                  {/* Statement of Appeal */}
                  <div className="space-y-2">
                    <label htmlFor="statement_of_appeal" className="block text-sm font-medium text-neutral-300">
                      Statement of Appeal <span className="text-red-400">*</span>
                    </label>
                    <textarea id="statement_of_appeal" name="statement_of_appeal" rows={5} required placeholder="Describe in detail the basis of your appeal, the decision or action being challenged, and why you believe it should be reconsidered..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                  </div>

                  {/* Supporting Evidence */}
                  <div className="space-y-2">
                    <label htmlFor="supporting_evidence" className="block text-sm font-medium text-neutral-300">
                      Supporting Evidence <span className="text-neutral-500">(optional)</span>
                    </label>
                    <textarea id="supporting_evidence" name="supporting_evidence" rows={3} placeholder="Describe any documents, records, communications, or other evidence supporting this appeal..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                  </div>

                  {/* Requested Relief */}
                  <div className="space-y-2">
                    <label htmlFor="requested_relief" className="block text-sm font-medium text-neutral-300">
                      Requested Relief <span className="text-red-400">*</span>
                    </label>
                    <textarea id="requested_relief" name="requested_relief" rows={3} required placeholder="Specify the relief or remedy you are seeking from the adjudicating body..." className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500" />
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={pending} className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50">
                    {pending ? "Filing…" : "File Appeal"}
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
          )}

          {/* Process Info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-white">Point Dispute Appeals</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Appeals of final point transactions must allege a constitutional
                rights violation under Article 4. The Society Adviser serves as
                Presiding Judge. A decision shall be rendered within fourteen
                (14) calendar days of filing.
              </p>
              <p className="mt-2 text-xs italic text-neutral-500">
                — Article I, Section 8
              </p>
            </article>
            <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-white">Records Access Appeals</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Appeals of access denials must be filed within five (5) calendar
                days of the denial. The High Council reviews the appeal within
                seven (7) business days and may uphold, modify, or reverse the
                decision by majority vote.
              </p>
              <p className="mt-2 text-xs italic text-neutral-500">
                — Article VIII, Section 6
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

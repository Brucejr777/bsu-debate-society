"use client";

import { useState, type FormEvent } from "react";

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];
const VIOLATION_TYPES = ["Minor Violation", "Major Violation"];

const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};

export default function DisciplinePage() {
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
    const fd = new FormData(form);

    const body = {
      complainant_name: fd.get("complainant_name") as string,
      complainant_house: fd.get("complainant_house") as string,
      respondent_name: fd.get("respondent_name") as string,
      respondent_house: fd.get("respondent_house") as string,
      incident_date: fd.get("incident_date") as string,
      incident_time: fd.get("incident_time") as string,
      incident_location: fd.get("incident_location") as string,
      violation_type: fd.get("violation_type") as string,
      provisions_violated: fd.get("provisions_violated") as string,
      description: fd.get("description") as string,
      evidence_summary: fd.get("evidence_summary") as string,
      witnesses: fd.get("witnesses") as string,
    };

    if (!body.complainant_name || !body.respondent_name || !body.description) {
      setStatus({ type: "error", message: "Required fields must be filled out." });
      setPending(false);
      return;
    }

    const res = await fetch("/api/discipline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setStatus({ type: "error", message: "Failed to file complaint. Please try again." });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message: "Complaint filed successfully. The Office of Internal Affairs will review within 3 business days.",
    });
    form.reset();
    setPending(false);
  }

  const inputCls =
    "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const selectCls = inputCls;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/"
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
              Back to Home
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Article VI — Rules & Procedures
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#ffb800] to-[#ff4d00] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              File a Disciplinary Complaint
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Any active member may report an alleged violation by submitting a written
              Complaint Form to the Office of Internal Affairs. Complaints must be filed
              within <span className="font-semibold text-white">fourteen (14) calendar days</span> of
              the incident or discovery thereof. All proceedings are confidential per
              Article VI, Section 8.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article VI, Section 3(1)
            </p>
          </article>

          {/* Violation Classification Info */}
          <article className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
              <h3 className="text-sm font-semibold text-amber-300">Minor Violations</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Failure to submit requirements, minor disrespect, minor negligence, or
                first-time procedural non-compliance. Adjudicated by the respective House
                Council.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
              <h3 className="text-sm font-semibold text-red-300">Major Violations</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Dishonesty, harassment, intentional disruption, discrimination,
                misappropriation of funds, or acts bringing disrepute. Adjudicated by the
                High Tribunal.
              </p>
            </div>
          </article>

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

          {/* Complaint Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Complainant Info */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Complainant Information</h2>
              <p className="text-xs text-neutral-500">Your details as the reporting member.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className={labelCls}>Full Name</label>
                <input id="c-name" name="complainant_name" required placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label htmlFor="c-house" className={labelCls}>House</label>
                <select id="c-house" name="complainant_house" defaultValue={HOUSES[0]} className={selectCls}>
                  {HOUSES.map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
            </div>

            {/* Respondent Info */}
            <div className="space-y-2 pt-4">
              <h2 className="text-lg font-semibold text-white">Respondent Information</h2>
              <p className="text-xs text-neutral-500">The member being reported.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="r-name" className={labelCls}>Respondent Name</label>
                <input id="r-name" name="respondent_name" required placeholder="Name of accused member" className={inputCls} />
              </div>
              <div>
                <label htmlFor="r-house" className={labelCls}>Respondent's House</label>
                <select id="r-house" name="respondent_house" defaultValue="" className={selectCls}>
                  <option value="" disabled>Select house</option>
                  {HOUSES.map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
            </div>

            {/* Incident Details */}
            <div className="space-y-2 pt-4">
              <h2 className="text-lg font-semibold text-white">Incident Details</h2>
              <p className="text-xs text-neutral-500">Date, time, and location of the alleged violation.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="inc-date" className={labelCls}>Date of Incident</label>
                <input id="inc-date" name="incident_date" type="date" required className={inputCls} />
              </div>
              <div>
                <label htmlFor="inc-time" className={labelCls}>Time (approximate)</label>
                <input id="inc-time" name="incident_time" type="time" className={inputCls} />
              </div>
              <div>
                <label htmlFor="inc-loc" className={labelCls}>Location</label>
                <input id="inc-loc" name="incident_location" required placeholder="Where it occurred" className={inputCls} />
              </div>
            </div>

            {/* Violation Classification */}
            <div className="space-y-2 pt-4">
              <h2 className="text-lg font-semibold text-white">Violation Classification</h2>
              <p className="text-xs text-neutral-500">The OIA will make the final classification.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="v-type" className={labelCls}>Violation Type</label>
                <select id="v-type" name="violation_type" defaultValue="" className={selectCls}>
                  <option value="" disabled>Select type</option>
                  {VIOLATION_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="v-prov" className={labelCls}>Provisions Violated</label>
                <input id="v-prov" name="provisions_violated" placeholder="e.g. Art. VI, Sec. 2(2)(b)" className={inputCls} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4">
              <h2 className="text-lg font-semibold text-white">Description of Incident</h2>
              <p className="text-xs text-neutral-500">Provide a factual account of what occurred.</p>
            </div>
            <div>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Describe the incident in detail…"
                className={inputCls + " resize-none"}
              />
            </div>

            {/* Evidence & Witnesses */}
            <div className="space-y-2 pt-4">
              <h2 className="text-lg font-semibold text-white">Evidence & Witnesses</h2>
              <p className="text-xs text-neutral-500">Optional — any supporting materials or witnesses.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="evidence" className={labelCls}>Evidence Summary</label>
                <textarea
                  id="evidence"
                  name="evidence_summary"
                  rows={3}
                  placeholder="Describe any evidence (photos, documents, messages, etc.)"
                  className={inputCls + " resize-none"}
                />
              </div>
              <div>
                <label htmlFor="witnesses" className={labelCls}>Witnesses</label>
                <textarea
                  id="witnesses"
                  name="witnesses"
                  rows={2}
                  placeholder="Names and contact info of witnesses (optional)"
                  className={inputCls + " resize-none"}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Filing…" : "File Complaint"}
            </button>

            {/* Due Process Notice */}
            <p className="text-center text-xs text-neutral-600">
              By submitting this form, you affirm that the information provided is true
              and accurate to the best of your knowledge. False or malicious complaints
              may result in disciplinary action under Article VI, Section 2(2)(b).
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

const MISCONDUCT_TYPES = [
  { value: "constitutional_violation", label: "Constitutional violation" },
  { value: "financial_irregularity", label: "Financial irregularity or misappropriation" },
  { value: "ethical_breach", label: "Ethical breach or code of conduct violation" },
  { value: "retaliation", label: "Retaliation or intimidation" },
  { value: "safety_threat", label: "Threat to member safety or institutional integrity" },
  { value: "other", label: "Other" },
];

export default function WhistleblowerPage() {
  const [pending, setPending] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      is_anonymous: isAnonymous,
      contact_method: isAnonymous ? null : (formData.get("contact_method") as string),
      misconduct_types: selectedTypes,
      parties_involved: formData.get("parties_involved") as string,
      factual_summary: formData.get("factual_summary") as string,
      supporting_documentation: formData.get("supporting_documentation") as string,
    };

    if (selectedTypes.length === 0) {
      toast.error("Please select at least one type of alleged misconduct.");
      setPending(false);
      return;
    }

    if (!body.factual_summary) {
      toast.error("Factual summary is required.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/whistleblower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to submit report. Please try again.");
        setPending(false);
        return;
      }

      toast.success(
        "Report submitted securely. The Office of Internal Affairs or Chief Adviser will review your disclosure. If you provided contact info, you will receive a confidential case reference number."
      );
      
      form.reset();
      setSelectedTypes([]);
      setIsAnonymous(true);
    } catch (error) {
      toast.error("Failed to connect to the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

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
              Constitution Art. 3, Sec. 14 &amp; R&amp;P Annex B, Sec. 6
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Confidential Whistleblower Reporting
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Society is committed to maintaining a confidential, non-retaliatory mechanism for reporting misconduct, ethical violations, or administrative malfeasance. Any member who discloses information in good faith regarding breaches of the Constitution, financial irregularities, or threats to institutional integrity shall be protected from retaliation, intimidation, or adverse action.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Constitution, Article 3, Section 14
            </p>
          </article>

          {/* Form */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">Secure Intake Form</h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with <span className="text-red-400">*</span> are required. Your identity will be protected to the fullest extent permitted by due process.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anonymity Preference */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="is_anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mt-1 size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
                    />
                    <div>
                      <label htmlFor="is_anonymous" className="text-sm font-semibold text-white">
                        I wish to remain fully anonymous
                      </label>
                      <p className="mt-1 text-xs text-neutral-400">
                        If checked, your identity will not be recorded or requested. If unchecked, you may provide a secure contact method for case updates.
                      </p>
                    </div>
                  </div>

                  {!isAnonymous && (
                    <div className="mt-4 space-y-2">
                      <label htmlFor="contact_method" className="block text-sm font-medium text-neutral-300">
                        Secure Contact Method <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact_method"
                        name="contact_method"
                        placeholder="e.g., ProtonMail address or encrypted messaging handle"
                        required={!isAnonymous}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                      />
                    </div>
                  )}
                </div>

                {/* Misconduct Types */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-300">
                    Nature of Alleged Misconduct <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {MISCONDUCT_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3 transition hover:border-neutral-600"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type.value)}
                          onChange={() => toggleType(type.value)}
                          className="mt-1 size-4 shrink-0 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
                        />
                        <span className="text-sm text-neutral-300">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Parties Involved */}
                <div className="space-y-2">
                  <label htmlFor="parties_involved" className="block text-sm font-medium text-neutral-300">
                    Parties Involved <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="parties_involved"
                    name="parties_involved"
                    placeholder="Names, positions, or Houses (provide only what is known)"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Factual Summary */}
                <div className="space-y-2">
                  <label htmlFor="factual_summary" className="block text-sm font-medium text-neutral-300">
                    Factual Summary <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="factual_summary"
                    name="factual_summary"
                    rows={6}
                    required
                    placeholder="Include dates, locations, specific incidents, and any other relevant factual details..."
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Supporting Documentation */}
                <div className="space-y-2">
                  <label htmlFor="supporting_documentation" className="block text-sm font-medium text-neutral-300">
                    Supporting Documentation <span className="text-neutral-500">(optional)</span>
                  </label>
                  <textarea
                    id="supporting_documentation"
                    name="supporting_documentation"
                    rows={3}
                    placeholder="Describe any attached evidence, document names, or reference links. (Do not submit original physical documents through this portal)."
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Good Faith Certification */}
                <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="good_faith"
                      name="good_faith"
                      required
                      className="mt-1 size-4 shrink-0 rounded border-amber-700 bg-neutral-800 accent-amber-500"
                    />
                    <label htmlFor="good_faith" className="text-sm text-amber-200/80">
                      <span className="font-semibold text-amber-200">Good Faith Certification:</span> I declare that this disclosure is made in good faith based on information reasonably believed to be true. I understand that knowingly false or malicious reports may constitute a Major Violation under Article VI, Section 2(2)(b), and that anonymity protections do not extend to disclosures made with intent to harm or deceive.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Submitting Securely…" : "Submit Confidential Report"}
                </button>
              </form>
            </div>
          </article>

          {/* Process Info */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-xl font-semibold text-white">What Happens Next?</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">1</div>
                  <h3 className="text-sm font-semibold text-white">Acknowledgment</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    The OIA Director or Chief Adviser will acknowledge submission within 48 hours via your preferred method (if provided), assigning a confidential case reference number.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">2</div>
                  <h3 className="text-sm font-semibold text-white">Investigation</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Investigations commence within 7 business days. Identity of anonymous disclosers is protected through technical and procedural safeguards.
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-5">
                  <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">3</div>
                  <h3 className="text-sm font-semibold text-white">Adjudication</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Findings are reviewed by the High Tribunal or relevant authority. Retaliation against any good-faith discloser is strictly prohibited and constitutes a Major Violation.
                  </p>
                </div>
              </div>
              <p className="text-xs italic text-neutral-500">
                — Rules and Procedures, Annex B, Section 6
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useState, type FormEvent } from "react";
import { HOUSES } from "@/lib/houses";

const AWARD_CATEGORIES = [
  "Leadership Excellence",
  "Communication Excellence",
  "Academic Excellence",
  "Creative Excellence",
];

const TIERS = ["Emerging Contributor", "Distinguished Member", "Society Fellow"];

const VALID_HOUSES = HOUSES.map((h) => h.value);

export default function NominatePage() {
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

    const nominatorName = formData.get("nominator_name") as string;
    const nominatorHouse = formData.get("nominator_house") as string;
    const nominatorEmail = (formData.get("nominator_email") as string) || null;
    const nomineeName = formData.get("nominee_name") as string;
    const nomineeHouse = formData.get("nominee_house") as string;
    const awardCategory = formData.get("award_category") as string;
    const tier = formData.get("tier") as string;
    const justification = formData.get("justification") as string;
    const supportingDocs = (formData.get("supporting_documentation") as string) || null;
    const semester = formData.get("semester") as string;

    if (
      !nominatorName ||
      !nominatorHouse ||
      !nomineeName ||
      !nomineeHouse ||
      !awardCategory ||
      !justification ||
      !semester
    ) {
      setStatus({
        type: "error",
        message: "All required fields must be filled.",
      });
      setPending(false);
      return;
    }

    if (!VALID_HOUSES.includes(nominatorHouse) || !VALID_HOUSES.includes(nomineeHouse)) {
      setStatus({ type: "error", message: "Please select a valid House." });
      setPending(false);
      return;
    }

    const res = await fetch("/api/nominations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nominator_name: nominatorName,
        nominator_house: nominatorHouse,
        nominator_email: nominatorEmail,
        nominee_name: nomineeName,
        nominee_house: nomineeHouse,
        award_category: awardCategory,
        tier,
        justification,
        supporting_documentation: supportingDocs,
        semester,
      }),
    });

    if (!res.ok) {
      setStatus({
        type: "error",
        message: "Failed to submit nomination. Please try again.",
      });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Nomination submitted successfully. The Selection Committee will review your nomination and notify you of the outcome.",
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
              Rules &amp; Procedures — Article II
            </p>
            <h1 className="inline-block rounded-lg bg-gradient-to-r from-[#e8c840] via-[#e8c840] to-[#e8c840] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Nominate for Individual Recognition
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Individual Recognition Framework honors the contributions, growth,
              and excellence of individual Society members. Any member may nominate a
              fellow member for recognition in one of four categories — Leadership,
              Communication, Academic, or Creative Excellence — each aligned with the
              embodied value of a House.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Article II, Section 3
            </p>
          </article>

          {/* Award Categories Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HOUSES.map((house, idx) => (
              <article
                key={house.value}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-sm shadow-black/20"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: house.color }}
                  />
                  <h3 className="text-sm font-semibold text-white">
                    {AWARD_CATEGORIES[idx]}
                  </h3>
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  {house.name} — {house.value}
                </p>
              </article>
            ))}
          </div>

          {/* Recognition Tiers */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="space-y-4">
              <h2 className="text-center text-xl font-semibold text-white">
                Recognition Tiers
              </h2>
              <div className="space-y-3">
                {TIERS.map((tier, i) => (
                  <div key={tier} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-sm font-bold text-neutral-300">
                      {i + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{tier}</p>
                      <p className="text-xs text-neutral-400">
                        {i === 0 &&
                          "First or second semester members demonstrating promising potential and early contributions. Non-exclusive."}
                        {i === 1 &&
                          "Consistent excellence over at least two semesters with documented impact. Limited to one per category per cycle."}
                        {i === 2 &&
                          "Highest honor. Exceptional Society-wide contributions across multiple categories or extended period (minimum three semesters). Requires unanimous Selection Committee agreement."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Nomination Form */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Nomination Form
                </h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with{" "}
                  <span className="text-red-400">*</span> are required. Your
                  nomination will be reviewed by the Selection Committee.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nominator Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="nominator_name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="nominator_name"
                    name="nominator_name"
                    placeholder="Juan dela Cruz"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Nominator House */}
                <div className="space-y-2">
                  <label
                    htmlFor="nominator_house"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Your House <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="nominator_house"
                    name="nominator_house"
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

                {/* Nominator Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="nominator_email"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Your Email{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="email"
                    id="nominator_email"
                    name="nominator_email"
                    placeholder="juan@bsu.edu.ph"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Nominee Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="nominee_name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Nominee&apos;s Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="nominee_name"
                    name="nominee_name"
                    placeholder="Maria Santos"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Nominee House */}
                <div className="space-y-2">
                  <label
                    htmlFor="nominee_house"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Nominee&apos;s House <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="nominee_house"
                    name="nominee_house"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select their House
                    </option>
                    {HOUSES.map((house) => (
                      <option key={house.value} value={house.value}>
                        {house.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Award Category */}
                <div className="space-y-2">
                  <label
                    htmlFor="award_category"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Award Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="award_category"
                    name="award_category"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {AWARD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier */}
                <div className="space-y-2">
                  <label
                    htmlFor="tier"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Recommended Tier
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select a tier (optional)
                    </option>
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Justification */}
                <div className="space-y-2">
                  <label
                    htmlFor="justification"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Statement of Justification{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="justification"
                    name="justification"
                    rows={5}
                    required
                    placeholder="Describe why this member deserves recognition, with specific examples of their contributions and impact..."
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Supporting Documentation */}
                <div className="space-y-2">
                  <label
                    htmlFor="supporting_documentation"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Supporting Documentation{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <textarea
                    id="supporting_documentation"
                    name="supporting_documentation"
                    rows={3}
                    placeholder="List any outputs, testimonials, evidence of impact, or other supporting materials (describe links or attachments)..."
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Semester <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="semester"
                    name="semester"
                    required
                    placeholder="e.g. First Semester 2025-2026"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Submitting…" : "Submit Nomination"}
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

          {/* Deadline Notice */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-sm shadow-black/20">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-neutral-400">
                Nominations must be submitted within the first four (4) weeks of the
                Second Semester for annual recognition, or within two (2) weeks for a
                special recognition cycle. The Secretary of Internal Affairs will verify
                eligibility within seven (7) calendar days of receipt.
              </p>
              <p className="text-xs italic text-neutral-500">
                — Article II, Section 3
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

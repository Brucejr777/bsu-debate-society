"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

const HOUSES = [
  { value: "Bathala", label: "House of Bathala", value_desc: "Leadership" },
  { value: "Kabunian", label: "House of Kabunian", value_desc: "Journalism" },
  { value: "Laon", label: "House of Laon", value_desc: "Academic" },
  { value: "Manama", label: "House of Manama", value_desc: "Arts" },
];
const VALID_HOUSES = HOUSES.map((h) => h.value);

const POINT_CATEGORIES = [
  { value: "society_wide_debate", label: "Society-Wide Debate" },
  { value: "house_wide_debate", label: "House-Wide Debate" },
  { value: "external_competition", label: "External Competition" },
  { value: "speaker_award", label: "Speaker / Individual Performance Award" },
];

const MEMBERSHIP_STATUSES = [
  { value: "executive_intern", label: "Executive Intern (Provisional Member)" },
  { value: "full_member", label: "Full Member" },
];

export default function ClaimPointsPage() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      member_name: formData.get("member_name") as string,
      house: formData.get("house") as string,
      membership_status: formData.get("membership_status") as string,
      activity_date: formData.get("activity_date") as string,
      activity_name: formData.get("activity_name") as string,
      organizing_body: formData.get("organizing_body") as string,
      point_category: formData.get("point_category") as string,
      points_claimed: parseInt(formData.get("points_claimed") as string, 10),
      evidence_link: formData.get("evidence_link") as string,
      additional_notes: formData.get("additional_notes") as string,
    };

    if (
      !body.member_name ||
      !body.house ||
      !body.membership_status ||
      !body.activity_date ||
      !body.activity_name ||
      !body.organizing_body ||
      !body.point_category ||
      isNaN(body.points_claimed) ||
      body.points_claimed === 0 ||
      !body.evidence_link
    ) {
      toast.error("All required fields must be filled out correctly.");
      setPending(false);
      return;
    }

    if (!VALID_HOUSES.includes(body.house)) {
      toast.error("Please select a valid House.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/claim-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to submit claim. Please try again.");
        setPending(false);
        return;
      }

      toast.success(
        "Point claim submitted successfully! The Secretary of Internal Affairs will review your claim within 5 business days."
      );
      form.reset();
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
              Rules &amp; Procedures — Annex A, Section 5
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Claim Individual Debate Points
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Members may proactively submit Individual Debate Point claims for eligible
              activities. Claims must be submitted within{" "}
              <span className="font-semibold text-white">fourteen (14) calendar days</span> of the activity's completion.
              All claims are subject to verification by the Secretary of Internal Affairs.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Annex A, Section 5
            </p>
          </article>

          {/* Claim Form */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">Point Claim Form</h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with <span className="text-red-400">*</span> are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Member Name */}
                <div className="space-y-2">
                  <label htmlFor="member_name" className="block text-sm font-medium text-neutral-300">
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

                {/* House */}
                <div className="space-y-2">
                  <label htmlFor="house" className="block text-sm font-medium text-neutral-300">
                    House <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="house"
                    name="house"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select your House
                    </option>
                    {HOUSES.map((house) => (
                      <option key={house.value} value={house.value}>
                        {house.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Membership Status */}
                <div className="space-y-2">
                  <label htmlFor="membership_status" className="block text-sm font-medium text-neutral-300">
                    Membership Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="membership_status"
                    name="membership_status"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select your status
                    </option>
                    {MEMBERSHIP_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Activity Details Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="activity_date" className="block text-sm font-medium text-neutral-300">
                      Activity Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      id="activity_date"
                      name="activity_date"
                      required
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="organizing_body" className="block text-sm font-medium text-neutral-300">
                      Organizing Body <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="organizing_body"
                      name="organizing_body"
                      placeholder="e.g., BSU Debate Society"
                      required
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                    />
                  </div>
                </div>

                {/* Activity Name */}
                <div className="space-y-2">
                  <label htmlFor="activity_name" className="block text-sm font-medium text-neutral-300">
                    Activity / Tournament Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="activity_name"
                    name="activity_name"
                    placeholder="e.g., Inter-House Debate Cup Round 1"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Point Category & Amount Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="point_category" className="block text-sm font-medium text-neutral-300">
                      Point Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="point_category"
                      name="point_category"
                      required
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {POINT_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="points_claimed" className="block text-sm font-medium text-neutral-300">
                      Points Claimed <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      id="points_claimed"
                      name="points_claimed"
                      placeholder="e.g., 15"
                      min="1"
                      required
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                    />
                  </div>
                </div>

                {/* Evidence Link */}
                <div className="space-y-2">
                  <label htmlFor="evidence_link" className="block text-sm font-medium text-neutral-300">
                    Evidence / Documentation Link <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    id="evidence_link"
                    name="evidence_link"
                    placeholder="https://docs.google.com/... or link to published results"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                  <p className="text-xs text-neutral-500">
                    Provide a link to official certificates, published results, signed attendance sheets, or judge decision sheets.
                  </p>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label htmlFor="additional_notes" className="block text-sm font-medium text-neutral-300">
                    Additional Notes <span className="text-neutral-500">(optional)</span>
                  </label>
                  <textarea
                    id="additional_notes"
                    name="additional_notes"
                    rows={3}
                    placeholder="Any specific details about your role, performance, or the event..."
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Submitting Claim…" : "Submit Point Claim"}
                </button>
              </form>
            </div>
          </article>

          {/* Deadline Notice */}
          <article className="rounded-3xl border border-amber-900/60 bg-amber-950/30 p-6 shadow-lg">
            <div className="mx-auto max-w-3xl space-y-2 text-center">
              <p className="text-sm leading-6 text-amber-300">
                <strong>Deadline:</strong> Point claims must be submitted within{" "}
                <strong>fourteen (14) calendar days</strong> of the activity's completion.
                Claims submitted after this deadline may be denied on procedural grounds.
              </p>
              <p className="text-xs italic text-amber-500/80">
                — Annex A, Section 5(1)
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
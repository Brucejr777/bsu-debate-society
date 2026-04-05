"use client";

import { useState, type FormEvent } from "react";

const HOUSES = [
  { value: "Bathala", label: "House of Bathala", value_desc: "Leadership" },
  { value: "Kabunian", label: "House of Kabunian", value_desc: "Journalism" },
  { value: "Laon", label: "House of Laon", value_desc: "Academic" },
  { value: "Manama", label: "House of Manama", value_desc: "Arts" },
];

const VALID_HOUSES = HOUSES.map((h) => h.value);

export default function ApplyPage() {
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

    const fullName = formData.get("full_name") as string;
    const studentId = formData.get("student_id") as string;
    const college = formData.get("college") as string;
    const houseChoice = formData.get("house_choice") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || null;
    const comments = (formData.get("comments") as string) || null;

    if (!fullName || !studentId || !college || !houseChoice || !email) {
      setStatus({ type: "error", message: "All required fields must be filled." });
      setPending(false);
      return;
    }

    if (!VALID_HOUSES.includes(houseChoice)) {
      setStatus({ type: "error", message: "Please select a valid House." });
      setPending(false);
      return;
    }

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        student_id: studentId,
        college,
        house_choice: houseChoice,
        email,
        phone,
        comments,
      }),
    });

    if (!res.ok) {
      setStatus({ type: "error", message: "Failed to submit application. Please try again." });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Application submitted successfully. The House Council will review your application and contact you.",
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
              Article 5 — Membership
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffec3a] via-[#ffd700] to-[#ffa100] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Join the Society
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Debate Society welcomes all students who seek to develop critical
              thinking, effective communication, and a spirit of intellectual curiosity.
              Fill out the application below to begin your membership journey.
            </p>
          </article>

          {/* ── Eligibility Notice ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-neutral-300"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.502 3.422a4.164 4.164 0 0 1 2.943-1.219h4.11a4.164 4.164 0 0 1 2.943 1.219l4.282 4.283a4.164 4.164 0 0 1 1.219 2.942v4.11a4.164 4.164 0 0 1-1.219 2.943l-4.282 4.282a4.164 4.164 0 0 1-2.943 1.219h-4.11a4.164 4.164 0 0 1-2.943-1.219L3.22 17.7a4.164 4.164 0 0 1-1.219-2.943v-4.11c0-1.104.439-2.163 1.219-2.943l4.282-4.282ZM12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Eligibility
                  </h2>
                </div>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                Membership in the Debate Society is open to{" "}
                <strong className="text-white">all students of Benguet State
                University</strong>, regardless of college, degree program, gender, class,
                race, political affiliation, religious belief, or any other personal
                background. Admission into one of the four Houses — Bathala, Kabunian,
                Laon, or Manama — constitutes formal membership in the Society.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 5, Section 1
              </p>
            </div>
          </article>

          {/* ── House Descriptions ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HOUSES.map((house) => (
              <article
                key={house.value}
                className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-sm shadow-black/20"
              >
                <h3 className="text-lg font-semibold text-white">
                  {house.label}
                </h3>
                <span className="mt-1 inline-block rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  {house.value_desc}
                </span>
              </article>
            ))}
          </div>

          {/* ── Application Form ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Membership Application
                </h2>
                <p className="text-sm text-neutral-500">
                  All fields marked with <span className="text-red-400">*</span> are
                  required. Your application will be reviewed by the House Council of
                  your chosen House.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="Juan dela Cruz"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Student ID */}
                <div className="space-y-2">
                  <label
                    htmlFor="student_id"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Student ID Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="student_id"
                    name="student_id"
                    placeholder="2024-XXXXX"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* College/Department */}
                <div className="space-y-2">
                  <label
                    htmlFor="college"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    College / Department <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    placeholder="College of Arts and Sciences"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="juan@bsu.edu.ph"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Phone Number{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Preferred House */}
                <div className="space-y-2">
                  <label
                    htmlFor="house_choice"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Preferred House <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="house_choice"
                    name="house_choice"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select a House
                    </option>
                    {HOUSES.map((house) => (
                      <option key={house.value} value={house.value}>
                        {house.label} — {house.value_desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Comments */}
                <div className="space-y-2">
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Why do you want to join?{" "}
                    <span className="text-neutral-500">(optional)</span>
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={4}
                    placeholder="Tell us about yourself and what draws you to the Debate Society…"
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Submitting…" : "Submit Application"}
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
        </div>
      </section>
    </div>
  );
}

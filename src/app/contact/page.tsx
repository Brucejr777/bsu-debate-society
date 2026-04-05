"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
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

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
      setStatus({ type: "error", message: "All fields are required." });
      setPending(false);
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (!res.ok) {
      setStatus({ type: "error", message: "Failed to send. Please try again." });
      setPending(false);
      return;
    }

    setStatus({
      type: "success",
      message: "Message sent to the Office of Public Affairs.",
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
              Get in Touch
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffec3a] via-[#ffd700] to-[#ffa100] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Contact Us
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              Whether you're a BSU student interested in joining the Society, an external
              organization looking to collaborate, or simply have questions about our
              activities — we'd love to hear from you. Below are the official channels
              through which you can reach the Debate Society.
            </p>
          </article>

          {/* ── Direct Contact ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href="mailto:debatesociety@bsu.edu.ph"
              className="group flex items-center gap-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg transition hover:border-neutral-700"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-300">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm font-medium text-white transition group-hover:text-blue-300">
                  debatesociety@bsu.edu.ph
                </p>
              </div>
            </a>

            <a
              href="tel:+639001234567"
              className="group flex items-center gap-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg transition hover:border-neutral-700"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-300">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.308c.816 0 1.515.579 1.667 1.381l.592 3.119a1.5 1.5 0 0 1-.635 1.508L6.108 8.52A16.013 16.013 0 0 0 15.48 17.892l2.012-1.324a1.5 1.5 0 0 1 1.509-.635l3.119.592c.802.152 1.38.851 1.38 1.667V19.5a3 3 0 0 1-3 3h-1.5C10.16 22.5 1.5 13.84 1.5 4.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Phone / Text</p>
                <p className="text-sm font-medium text-white transition group-hover:text-emerald-300">
                  +63 900 123 4567
                </p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-amber-300">
                  <path fillRule="evenodd" d="M11.54 2.12a1.46 1.46 0 0 1 .92 0c4.01 1.23 6.54 3.47 8.07 5.77 1.53 2.3 2.17 5.08 2.17 8.11 0 1.27-.32 2.5-.79 3.59a9.144 9.144 0 0 1-1.59 2.64 1.46 1.46 0 0 1-.66.48c-2.07.72-4.24 1.12-6.66 1.12-2.42 0-4.59-.4-6.66-1.12a1.46 1.46 0 0 1-.66-.48 9.14 9.14 0 0 1-1.59-2.64A8.89 8.89 0 0 1 3.3 16c0-3.03.64-5.81 2.17-8.11 1.53-2.3 4.06-4.54 8.07-5.77Zm-3.2 14.07c.36-.66.9-1.06 1.59-1.22A2.95 2.95 0 0 1 12 14.5c.75 0 1.42.2 1.97.57.55.37.93.89 1.1 1.55a1.46 1.46 0 0 1-.47 1.57 3.03 3.03 0 0 1-1.72.7 2.9 2.9 0 0 1-2.12-.7 1.46 1.46 0 0 1-.47-1.57Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Office Hours</p>
                <p className="text-sm font-medium text-white">
                  Mon–Fri, 8 AM – 5 PM
                </p>
              </div>
            </div>
          </div>

          {/* ── Location ── */}
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
                      d="M11.54 2.12a1.46 1.46 0 0 1 .92 0c4.01 1.23 6.54 3.47 8.07 5.77 1.53 2.3 2.17 5.08 2.17 8.11 0 1.27-.32 2.5-.79 3.59a9.144 9.144 0 0 1-1.59 2.64 1.46 1.46 0 0 1-.66.48c-2.07.72-4.24 1.12-6.66 1.12-2.42 0-4.59-.4-6.66-1.12a1.46 1.46 0 0 1-.66-.48 9.14 9.14 0 0 1-1.59-2.64A8.89 8.89 0 0 1 3.3 16c0-3.03.64-5.81 2.17-8.11 1.53-2.3 4.06-4.54 8.07-5.77Zm-3.2 14.07c.36-.66.9-1.06 1.59-1.22A2.95 2.95 0 0 1 12 14.5c.75 0 1.42.2 1.97.57.55.37.93.89 1.1 1.55a1.46 1.46 0 0 1-.47 1.57 3.03 3.03 0 0 1-1.72.7 2.9 2.9 0 0 1-2.12-.7 1.46 1.46 0 0 1-.47-1.57Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Location</h2>
                </div>
              </div>
              <p className="text-base leading-7 text-neutral-300">
                Benguet State University — Governor Pack Road, Baguio City, Benguet,
                Philippines. The Debate Society operates within the campus and conducts
                its activities, meetings, and tournaments at designated university
                facilities.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 1 &amp; Article 3, Section 4
              </p>
            </div>
          </article>

          {/* ── Membership Inquiries ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-neutral-300"
                  >
                    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.625 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0Zm-10.125 9a4.125 4.125 0 0 1 3.876-4.114c.37-.024.746-.036 1.125-.036.378 0 .754.012 1.125.036A4.125 4.125 0 0 1 14.5 15.375v.75a4.125 4.125 0 0 1-4.125 4.125h-2.25A4.125 4.125 0 0 1 4 16.125v-.75Zm10.125 0a4.125 4.125 0 0 1 3.876-4.114c.37-.024.746-.036 1.125-.036.378 0 .754.012 1.125.036A4.125 4.125 0 0 1 24.625 15.375v.75a4.125 4.125 0 0 1-4.125 4.125h-2.25A4.125 4.125 0 0 1 14.125 16.125v-.75Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Membership Inquiries
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Constitution, Article 5 — Membership
                  </p>
                </div>
              </div>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <p className="text-base leading-7 text-neutral-300">
                Membership in the Debate Society is open to{" "}
                <strong className="text-white">all students of Benguet State
                University</strong>, regardless of college, degree program, gender, class,
                race, political affiliation, religious belief, or any other personal
                background. The Society is built on the principles of inclusivity, equal
                access, and the belief that every voice deserves a place at the table.
              </p>
              <p className="text-base leading-7 text-neutral-300">
                Interested students may apply directly to{" "}
                <strong className="text-white">one of the four Houses</strong> —
                Bathala, Kabunian, Laon, or Manama. Each House maintains its own
                membership policy aligned with the Society's Constitution, and all
                applications are reviewed and approved by the respective House Council.
                No individual may be a member of more than one House at a time.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 5, Sections 1 &amp; 3
              </p>
              <a
                href="/houses"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Explore the Houses
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </article>
          </div>

          {/* ── External Partnerships ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
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
                      d="M4.125 3A3.125 3.125 0 0 0 1 6.125v2.75A3.125 3.125 0 0 0 4.125 12h2.75A3.125 3.125 0 0 0 10 8.875v-2.75A3.125 3.125 0 0 0 6.875 3h-2.75Zm13 0A3.125 3.125 0 0 0 14 6.125v2.75A3.125 3.125 0 0 0 17.125 12h2.75A3.125 3.125 0 0 0 23 8.875v-2.75A3.125 3.125 0 0 0 19.875 3h-2.75Zm-13 13A3.125 3.125 0 0 0 1 19.125v1.75A1.125 1.125 0 0 0 2.125 22h1.75A3.125 3.125 0 0 0 7 18.875v-1.75A3.125 3.125 0 0 0 3.875 14H4.125Zm13 0A3.125 3.125 0 0 0 14 19.125v1.75A1.125 1.125 0 0 0 15.125 22h1.75A3.125 3.125 0 0 0 20 18.875v-1.75A3.125 3.125 0 0 0 16.875 14h-2.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    External Partnerships
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Office of External Affairs — Constitution, Article 8, Section 8
                  </p>
                </div>
              </div>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <p className="text-base leading-7 text-neutral-300">
                The{" "}
                <strong className="text-white">Office of External Affairs</strong>{" "}
                serves as the bridge between the Society and external entities. It
                negotiates partnerships and Memoranda of Agreement (MOAs), solicits
                grants and sponsorships, and manages the Society's presence on national
                and international debating circuits.
              </p>
              <p className="text-base leading-7 text-neutral-300">
                All external partnerships, collaborations, sponsorships, and Memoranda
                of Agreement should be directed to this office. Please note that all
                external agreements require the{" "}
                <strong className="text-white">final approval of the Society
                President</strong> before they become binding on the organization.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 8, Section 4 &amp; Section 8
              </p>
            </article>
          </div>

          {/* ── General Inquiries & Media ── */}
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-neutral-300"
                  >
                    <path d="M4.984 3.798A1.125 1.125 0 0 0 3 4.626v14.748c0 .663.576 1.15 1.187.995l13.165-3.36a1.125 1.125 0 0 0 .833-1.089V5.079a1.125 1.125 0 0 0-.833-1.09L4.984 3.798Zm4.64 9.105a.75.75 0 0 1 0-1.06l1.5-1.5a.75.75 0 1 1 1.06 1.06L10.807 12l1.377 1.377a.75.75 0 1 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    General Inquiries &amp; Media
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Office of Public Affairs — Constitution, Article 8, Section 11
                  </p>
                </div>
              </div>
            </div>

            <article className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
              <p className="text-base leading-7 text-neutral-300">
                The{" "}
                <strong className="text-white">Office of Public Affairs</strong> manages
                all official Society communications, social media presence, and branding
                standards. It serves as the public information office, ensuring that all
                members and the general public are well-informed of Society activities,
                resolutions, and official positions.
              </p>
              <p className="text-base leading-7 text-neutral-300">
                For public inquiries, media relations, press requests, website concerns,
                or any questions about the Society's public-facing activities, please
                reach out through this office.
              </p>
              <p className="text-sm italic text-neutral-500">
                — Constitution, Article 8, Section 11
              </p>
            </article>
          </div>

          {/* ── Contact Form ── */}
          <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30">
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Send Us a Message
                </h2>
                <p className="text-sm text-neutral-500">
                  Submissions are delivered directly to the Office of Public Affairs.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Juan dela Cruz"
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
                    Email Address
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

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="membership">Membership Inquiry</option>
                    <option value="partnership">
                      External Partnership / Sponsorship
                    </option>
                    <option value="media">Media / Press Inquiry</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Write your message here…"
                    required
                    className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Sending…" : "Send Message"}
                </button>

                {/* Feedback Messages */}
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

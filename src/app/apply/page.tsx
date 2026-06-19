// src/app/apply/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { HOUSES } from "@/lib/houses";

export default function ApplyPage() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      full_name: formData.get("full_name") as string,
      student_id: formData.get("student_id") as string,
      college: formData.get("college") as string,
      house_choice: formData.get("house_choice") as string, // Now correctly sends "Bathala", "Kabunian", etc.
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      comments: (formData.get("comments") as string) || null,
      motivation: (formData.get("motivation") as string) || null,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit application.");
      }

      toast.success("Application submitted successfully! The House Council will review it shortly.");
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300 mb-1.5";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Article V — Membership
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Membership Application
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-neutral-400">
              Join the premier debating community at BSU. Fill out the form below to apply for membership. 
              Your application will be reviewed by the Council of your chosen House.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className={labelCls}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    placeholder="Juan dela Cruz"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="student_id" className={labelCls}>
                    Student ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="student_id"
                    name="student_id"
                    required
                    placeholder="2024-12345"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelCls}>
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="juan.delacruz@bsu.edu.ph"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>
                    Phone Number <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="09XX-XXX-XXXX"
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="college" className={labelCls}>
                    College / Department <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    required
                    placeholder="e.g., College of Arts and Sciences"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* House Preference */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">House Preference</h2>
              <div>
                <label htmlFor="house_choice" className={labelCls}>
                  Preferred House <span className="text-red-400">*</span>
                </label>
                <select
                  id="house_choice"
                  name="house_choice"
                  required
                  className={inputCls}
                >
                  <option value="" disabled>
                    Select your preferred House
                  </option>
                  {HOUSES.map((house) => (
                    // FIX 1: Changed value to the short house name (e.g., "Bathala") 
                    // so the database stores the correct identifier instead of "Leadership".
                    // FIX 2: Changed house.value_desc to house.value to fix the TypeScript error.
                    <option key={house.slug} value={house.name.replace("House of ", "")}>
                      {house.name} — {house.value}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-neutral-500">
                  Your application will be routed directly to the Chancellor of this House for review.
                </p>
              </div>
            </div>

            {/* Motivation & Comments */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Application Details</h2>
              
              {/* Why do you want to join? */}
              <div>
                <label htmlFor="motivation" className={labelCls}>
                  Why do you want to join? <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  rows={4}
                  placeholder="Tell us a bit about your interest in debate, your past experience (if any), and what you hope to contribute to the Society..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="comments" className={labelCls}>
                  Additional Comments / Questions <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={3}
                  placeholder="Any other information you'd like us to know?"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-neutral-100 px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
            <p className="text-xs leading-5 text-neutral-500">
              By submitting this application, you acknowledge that all information provided is accurate. 
              Membership is subject to the approval of the respective House Council and the overarching 
              Constitution of the BSU Debate Society.
            </p>
            <p className="mt-1 text-[11px] italic text-neutral-600">
              — Constitution, Article V (Membership)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
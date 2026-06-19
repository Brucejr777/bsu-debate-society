// src/app/register/page.tsx
"use client";

import { useFormState } from "react-dom";
import { registerOfficer } from "@/actions/register";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  
  // Connect the form to the Server Action
  const [state, formAction] = useFormState(registerOfficer, null);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6">
      <div className="w-full rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Officer Onboarding
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-sm text-neutral-400">
              Register to join the BSU Debate Society administrative portal.
            </p>
          </div>

          {/* Success Message */}
          {justRegistered && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
              Account created successfully! Please log in. Your role will be assigned by the President shortly.
            </div>
          )}

          {/* Registration Form */}
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm font-medium text-neutral-300">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                placeholder="Juan dela Cruz"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                Officer Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="officer@bsu.edu.ph"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              />
            </div>

            {state?.error && (
              <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-xs text-neutral-600">
            Already have an account?{" "}
            <a href="/admin/login" className="text-neutral-400 hover:text-white underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <RegisterForm />
    </Suspense>
  );
}
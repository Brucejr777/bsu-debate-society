// src/app/admin/login/page.tsx
"use client";

import { useFormState } from "react-dom";
import { adminLogin } from "@/actions/admin";

export default function AdminLoginPage() {
  // Connect the form to the Server Action
  // Note: useFormState is used instead of useActionState for React 18 / Next.js 14 compatibility
  const [state, formAction] = useFormState(adminLogin, null);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6">
      <div className="w-full rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Restricted Access
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Officer Portal
            </h1>
            <p className="text-sm text-neutral-400">
              Enter your credentials to access the Society dashboard.
            </p>
          </div>

          {/* Back Link */}
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

          {/* Login Form */}
          <form action={formAction} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                Officer Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="officer@bsu.edu.ph"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign In
            </button>
          </form>

          {/* Info Note */}
          <p className="text-center text-xs text-neutral-600">
            If you do not have an account or your role is pending, please contact the Executive Secretary.
          </p>
        </div>
      </div>
    </div>
  );
}
// src/app/admin/layout.tsx
import type { ReactNode } from "react";
import { createServerSupabaseClient } from "@/lib/auth";
import { Role } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const { data: officer } = await supabase
    .from("officers")
    .select("id, email, full_name, role, house_affiliation")
    .eq("id", user.id)
    .single();

  if (!officer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-red-900/40 bg-red-950/20 p-8 text-center shadow-xl shadow-black/30">
          <h2 className="text-xl font-semibold text-red-200">Account Not Provisioned</h2>
          <p className="mt-3 text-sm leading-6 text-red-300/80">
            You are authenticated, but your officer profile has not been created in the database.
            Please contact the Executive Secretary or check your Supabase setup.
          </p>
        </div>
      </div>
    );
  }

  if (officer.role === Role.PENDING) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-amber-900/40 bg-amber-950/20 p-8 text-center shadow-xl shadow-black/30">
          <h2 className="text-xl font-semibold text-amber-200">Role Pending Assignment</h2>
          <p className="mt-3 text-sm leading-6 text-amber-300/80">
            Your officer account is active, but your constitutional role has not
            yet been assigned by the President or Executive Secretary.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {children}
      </main>
    </div>
  );
}
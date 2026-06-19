// src/app/admin/users/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { Role, House, RBAC, isHouseChancellor } from "@/lib/rbac";

// ── Types ──
interface OfficerRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
  house_affiliation: string;
  created_at: string;
}

// ── Constants ──
const ALL_ROLES = [
  { value: "pending", label: "Pending Assignment" },
  { value: "president", label: "President" },
  { value: "vice_president", label: "Vice President" },
  { value: "executive_secretary", label: "Executive Secretary" },
  { value: "sia", label: "Secretary of Internal Affairs (Point Keeper)" },
  { value: "oia_director", label: "OIA Director" },
  { value: "ofra", label: "Office of Financial & Resource Affairs" },
  { value: "external_affairs", label: "Secretary of External Affairs" },
  { value: "business_affairs", label: "Secretary of Business Affairs" },
  { value: "public_affairs", label: "Secretary of Public Affairs" },
  { value: "chief_adviser", label: "Chief Adviser" },
  { value: "chancellor_bathala", label: "Chancellor — House of Bathala" },
  { value: "chancellor_kabunian", label: "Chancellor — House of Kabunian" },
  { value: "chancellor_laon", label: "Chancellor — House of Laon" },
  { value: "chancellor_manama", label: "Chancellor — House of Manama" },
];

const ALL_HOUSES = [
  { value: "Society-wide", label: "Society-wide" },
  { value: "Bathala", label: "House of Bathala" },
  { value: "Kabunian", label: "House of Kabunian" },
  { value: "Laon", label: "House of Laon" },
  { value: "Manama", label: "House of Manama" },
];

const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
  "Society-wide": "#44403c",
};

const ROLE_BADGE: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-300 border-yellow-800/50",
  president: "bg-amber-900/50 text-amber-300 border-amber-800/50",
  vice_president: "bg-amber-900/40 text-amber-200 border-amber-800/40",
  executive_secretary: "bg-sky-900/40 text-sky-300 border-sky-800/40",
  sia: "bg-emerald-900/40 text-emerald-300 border-emerald-800/40",
  oia_director: "bg-rose-900/40 text-rose-300 border-rose-800/40",
  ofra: "bg-teal-900/40 text-teal-300 border-teal-800/40",
  chief_adviser: "bg-purple-900/40 text-purple-300 border-purple-800/40",
};

function getRoleBadgeClass(role: string): string {
  return ROLE_BADGE[role] || "bg-neutral-800 text-neutral-300 border-neutral-700";
}

function getRoleLabel(role: string): string {
  const found = ALL_ROLES.find((r) => r.value === role);
  return found ? found.label : role;
}

// ── Component ──
export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<Officer | null>(null);
  const [officers, setOfficers] = useState<OfficerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editHouse, setEditHouse] = useState("");
  const [editName, setEditName] = useState("");

  // 1. Fetch current user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.officer || null))
      .catch(() => setCurrentUser(null));
  }, []);

  // 2. Fetch all officers
  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch officers");
      const data = await res.json();
      setOfficers(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load officer profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchOfficers();
  }, [currentUser]);

  // 3. Start editing
  function startEdit(officer: OfficerRow) {
    setEditingId(officer.id);
    setEditRole(officer.role);
    setEditHouse(officer.house_affiliation);
    setEditName(officer.full_name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditRole("");
    setEditHouse("");
    setEditName("");
  }

  // 4. Save changes
  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    setSaving(editingId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          role: editRole,
          house_affiliation: editHouse,
          full_name: editName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update officer");
      }

      toast.success("Officer profile updated successfully");
      cancelEdit();
      fetchOfficers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update officer");
    } finally {
      setSaving(null);
    }
  }

  // 5. Stats
  const pendingCount = officers.filter((o) => o.role === "pending").length;
  const activeCount = officers.filter((o) => o.role !== "pending").length;

  // ── RBAC Check: Only President and Executive Secretary ──
  const canManageUsers = (officer: Officer) =>
    officer.role === Role.PRESIDENT || officer.role === Role.EXECUTIVE_SECRETARY;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Officer Management</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Assign roles and house affiliations to authenticated Society officers.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center rounded-full border border-yellow-800/50 bg-yellow-900/30 px-3 py-1 text-xs font-semibold text-yellow-300">
            {pendingCount} Pending
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-800/50 bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            {activeCount} Active
          </span>
        </div>
      </div>

      {/* RBAC Guard */}
      <RBACGuard officer={currentUser} checkPermission={canManageUsers}>
        {/* Officers Table */}
        <section className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/95 shadow-xl shadow-black/30">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <div className="size-8 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
            </div>
          ) : officers.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-sm text-neutral-500">No officer profiles found.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/60">
              {officers.map((officer) => {
                const isEditing = editingId === officer.id;
                const houseColor = HOUSE_COLORS[officer.house_affiliation] || "#44403c";
                const isPending = officer.role === "pending";

                return (
                  <div
                    key={officer.id}
                    className={`p-5 transition ${isPending ? "bg-yellow-950/10" : "bg-transparent"} hover:bg-neutral-900/50`}
                  >
                    {isEditing ? (
                      /* ── Edit Mode ── */
                      <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {/* Full Name */}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-600"
                              required
                            />
                          </div>

                          {/* Role */}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                              Role
                            </label>
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-600"
                            >
                              {ALL_ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                  {r.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* House */}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                              House Affiliation
                            </label>
                            <select
                              value={editHouse}
                              onChange={(e) => setEditHouse(e.target.value)}
                              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-600"
                            >
                              {ALL_HOUSES.map((h) => (
                                <option key={h.value} value={h.value}>
                                  {h.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="flex items-end gap-2">
                            <button
                              type="submit"
                              disabled={saving === officer.id}
                              className="rounded-full bg-amber-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
                            >
                              {saving === officer.id ? "Saving…" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        {/* Auto-set house based on chancellor role */}
                        {editRole.startsWith("chancellor_") && (
                          <p className="text-xs text-amber-400/80">
                            ⓘ Chancellor roles automatically bind to their respective House.
                          </p>
                        )}
                      </form>
                    ) : (
                      /* ── View Mode ── */
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ backgroundColor: houseColor }}
                          >
                            {officer.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {officer.full_name}
                            </p>
                            <p className="truncate text-xs text-neutral-500">{officer.email}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Role Badge */}
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getRoleBadgeClass(officer.role)}`}
                          >
                            {getRoleLabel(officer.role)}
                          </span>

                          {/* House Badge */}
                          <span
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold text-white"
                            style={{
                              backgroundColor: `${houseColor}66`,
                              borderColor: `${houseColor}88`,
                            }}
                          >
                            {officer.house_affiliation}
                          </span>

                          {/* Edit Button */}
                          <button
                            onClick={() => startEdit(officer)}
                            className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Info Card */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30">
          <h2 className="text-sm font-semibold text-white">How Role Assignment Works</h2>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-neutral-400">
            <li>
              <span className="font-semibold text-neutral-300">1.</span> Users sign up via the login
              page with their email and password. Their profile is automatically created with a{" "}
              <span className="font-semibold text-yellow-400">pending</span> role.
            </li>
            <li>
              <span className="font-semibold text-neutral-300">2.</span> The President or Executive
              Secretary assigns the appropriate role and house affiliation using this page.
            </li>
            <li>
              <span className="font-semibold text-neutral-300">3.</span> Once assigned, the
              officer&apos;s dashboard, sidebar navigation, and database permissions (via Row Level
              Security) automatically adapt to their constitutional jurisdiction.
            </li>
            <li>
              <span className="font-semibold text-neutral-300">4.</span> Chancellor roles (e.g.,{" "}
              <code className="rounded bg-neutral-800 px-1 text-[10px] text-neutral-300">
                chancellor_bathala
              </code>
              ) should have their house set to the corresponding House. High Council roles should be
              set to{" "}
              <code className="rounded bg-neutral-800 px-1 text-[10px] text-neutral-300">
                Society-wide
              </code>
              .
            </li>
          </ul>
        </section>
      </RBACGuard>
    </div>
  );
}
// src/app/admin/league/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { RBAC, Role } from "@/lib/rbac";

interface Officer {
  id: string;
  email: string;
  full_name: string;
  role: string;
  house_affiliation: string;
}

const HOUSES = ["Bathala", "Kabunian", "Laon", "Manama"];
const HOUSE_LABELS: Record<string, string> = {
  Bathala: "House of Bathala",
  Kabunian: "House of Kabunian",
  Laon: "House of Laon",
  Manama: "House of Manama",
};
const HOUSE_COLORS: Record<string, string> = {
  Bathala: "#8b0000",
  Kabunian: "#280137",
  Laon: "#000b90",
  Manama: "#006400",
};

interface LeagueMember {
  id: number;
  created_at: string;
  member_name: string;
  house: string;
  individual_points: number;
  semester: string;
  rank: number;
}

const emptyForm = {
  member_name: "",
  house: HOUSES[0],
  individual_points: "0",
  semester: "2026-2027 Second Semester",
  rank: "1",
};

export default function AdminLeaguePage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage the League roster
  const canManage = officer
    ? RBAC.canAccessAdminRoute(officer.role as Role, "/admin/league")
    : false;

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/league");
      if (!res.ok) throw new Error("Failed to fetch members.");
      const data = await res.json();
      setMembers(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load League roster.");
    } finally {
      setLoading(false);
    }
  }

  async function submitMember(e: FormEvent) {
    e.preventDefault();
    const body = {
      member_name: form.member_name,
      house: form.house,
      individual_points: parseInt(form.individual_points, 10) || 0,
      semester: form.semester,
      rank: parseInt(form.rank, 10) || 1,
    };

    const previousMembers = [...members];
    const tempId = editingId ?? Date.now();
    
    setMembers((prev) =>
      editingId
        ? prev.map((m) => (m.id === editingId ? { ...m, ...body } : m))
        : [{ id: tempId, created_at: new Date().toISOString(), ...body }, ...prev]
    );

    try {
      const res = editingId
        ? await fetch("/api/admin/league", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...body }),
          })
        : await fetch("/api/admin/league", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save.");
      }
      const data = await res.json();
      
      setMembers((prev) =>
        editingId
          ? prev.map((m) => (m.id === editingId ? data : m))
          : prev.map((m) => (m.id === tempId ? data : m))
      );
      toast.success(editingId ? "Member updated." : "Member added to roster.");
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setMembers(previousMembers);
      toast.error(err.message || "Failed to save member.");
    }
  }

  async function deleteMember(id: number) {
    if (!confirm("Are you sure you want to remove this member from the League roster?")) return;
    const previousMembers = [...members];
    setMembers((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch("/api/admin/league", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Member removed from roster.");
    } catch (err) {
      setMembers(previousMembers);
      toast.error("Failed to remove member.");
    }
  }

  function startEdit(m: LeagueMember) {
    setEditingId(m.id);
    setForm({
      member_name: m.member_name,
      house: m.house,
      individual_points: m.individual_points.toString(),
      semester: m.semester,
      rank: m.rank.toString(),
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  const updateForm = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500";
  const labelCls = "block text-sm font-medium text-neutral-300";
  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnSecondary = "rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white";
  const btnDanger = "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Debate League Roster</h1>
        <p className="text-sm text-neutral-400">
          Manage the official Debate League roster per Article III, Section 3. 
          The Selection Committee certifies the top representatives for the semester.
        </p>
      </div>

      {/* View Only Notice for Unauthorized Roles */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-300/80">
            <strong className="text-amber-200">View Only:</strong> Per the Society Constitution and Rules, 
            only the <strong className="text-white">High Council and House Chancellors (Selection Committee)</strong> can manage 
            the Debate League roster. You may view the roster for transparency purposes.
          </p>
        </div>
      )}

      {/* Load / Add Buttons */}
      <div className="flex gap-2">
        {!fetched && (
          <button onClick={fetchMembers} disabled={loading} className={btnPrimary}>
            {loading ? "Loading…" : "Load Roster"}
          </button>
        )}
        {fetched && !showForm && canManage && (
          <button onClick={startNew} className={btnPrimary}>
            + Add Member
          </button>
        )}
      </div>

      {/* Form (Protected) */}
      {showForm && canManage && (
        <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editingId ? "Edit League Member" : "Add New League Member"}
          </h2>
          <form onSubmit={submitMember} className="mx-auto max-w-xl space-y-4">
            <div>
              <label className={labelCls}>Member Name</label>
              <input value={form.member_name} onChange={(e) => updateForm("member_name", e.target.value)} required placeholder="Juan dela Cruz" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>House</label>
                <select value={form.house} onChange={(e) => updateForm("house", e.target.value)} className={inputCls}>
                  {HOUSES.map((h) => <option key={h} value={h}>{HOUSE_LABELS[h]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Rank</label>
                <input type="number" min="1" value={form.rank} onChange={(e) => updateForm("rank", e.target.value)} required className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Individual Points</label>
                <input type="number" value={form.individual_points} onChange={(e) => updateForm("individual_points", e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Semester</label>
                <input value={form.semester} onChange={(e) => updateForm("semester", e.target.value)} required placeholder="2026-2027 Second Semester" className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className={btnPrimary}>{editingId ? "Update" : "Add to Roster"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className={btnSecondary}>Cancel</button>
            </div>
          </form>
        </article>
      )}

      {/* Empty State */}
      {fetched && members.length === 0 && (
        <p className="text-sm text-neutral-500">No members in the League roster yet.</p>
      )}

      {/* Members Table */}
      {fetched && members.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500">
                <th className="px-5 py-3 font-medium uppercase tracking-wider">Rank</th>
                <th className="px-5 py-3 font-medium uppercase tracking-wider">Member</th>
                <th className="px-5 py-3 font-medium uppercase tracking-wider">House</th>
                <th className="px-5 py-3 font-medium uppercase tracking-wider">Semester</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Points</th>
                {canManage && <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const color = HOUSE_COLORS[m.house] ?? "#666";
                return (
                  <tr key={m.id} className="border-b border-neutral-800/50 transition hover:bg-neutral-800/50">
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex size-7 items-center justify-center rounded-md text-xs font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {m.rank}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{m.member_name}</td>
                    <td className="px-5 py-4 text-neutral-400">
                      {HOUSE_LABELS[m.house] ?? m.house}
                    </td>
                    <td className="px-5 py-4 text-neutral-400 text-xs">{m.semester}</td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-400">
                      {m.individual_points}
                    </td>
                    {canManage && (
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(m)} className={btnEdit}>Edit</button>
                          <button onClick={() => deleteMember(m.id)} className={btnDanger}>Remove</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
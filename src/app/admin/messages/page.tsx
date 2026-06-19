// src/app/admin/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import RBACGuard, { type Officer } from "@/components/RBACGuard";
import { RBAC, Role } from "@/lib/rbac";

interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
}

export default function AdminMessagesPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 1. Fetch current officer profile for RBAC
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOfficer(data?.officer || null))
      .catch(() => setOfficer(null));
  }, []);

  // 2. Determine if user can manage messages
  const canManage = officer
    ? RBAC.canAccessAdminRoute(officer.role as Role, "/admin/messages")
    : false;

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to fetch messages.");
      const data = await res.json();
      setMessages(data);
      setFetched(true);
    } catch (err) {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id: number, currentStatus: boolean) {
    // Optimistic update
    const previousMessages = [...messages];
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: !currentStatus } : m))
    );

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: !currentStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update.");
      const data = await res.json();
      
      // Confirm with actual server response
      setMessages((prev) => prev.map((m) => (m.id === id ? data : m)));
      toast.success(`Marked as ${!currentStatus ? "read" : "unread"}.`);
    } catch (err: any) {
      // Revert on failure
      setMessages(previousMessages);
      toast.error(err.message || "Failed to update message status.");
    }
  }

  async function deleteMessage(id: number) {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;

    // Optimistic update
    const previousMessages = [...messages];
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Message deleted.");
    } catch (err) {
      // Revert on failure
      setMessages(previousMessages);
      toast.error("Failed to delete message.");
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const btnPrimary = "rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200";
  const btnEdit = "rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700";
  const btnDanger = "rounded-full bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Public Contact Inbox</h1>
          <p className="text-sm text-neutral-400">
            Manage public inquiries and contact form submissions per Constitution Art. 8, Sec. 11.
          </p>
        </div>
        {fetched && (
          <div className="flex gap-3">
            <span className="inline-flex items-center rounded-full border border-blue-800/50 bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-300">
              {unreadCount} Unread
            </span>
            <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/50 px-3 py-1 text-xs font-semibold text-neutral-400">
              {messages.length} Total
            </span>
          </div>
        )}
      </div>

      {/* View Only / Access Denied Notice for Unauthorized Roles */}
      {!canManage && officer && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
          <p className="text-sm leading-6 text-red-300/80">
            <strong className="text-red-200">Access Restricted:</strong> Per the Society Constitution, 
            only the <strong className="text-white">Office of Public Affairs, High Council, and House Chancellors</strong> can 
            access and manage the public contact inbox.
          </p>
        </div>
      )}

      {/* RBAC Guard for the actual inbox content */}
      <RBACGuard 
        officer={officer} 
        checkPermission={(o) => RBAC.canAccessAdminRoute(o.role as Role, "/admin/messages")}
      >
        {/* Load Button */}
        {!fetched && (
          <button
            onClick={fetchMessages}
            disabled={loading}
            className={btnPrimary}
          >
            {loading ? "Loading…" : "Load Inbox"}
          </button>
        )}

        {/* Empty State */}
        {fetched && messages.length === 0 && (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mx-auto size-10 text-neutral-700">
              <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
              <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
            </svg>
            <p className="mt-4 text-sm text-neutral-500">No messages in the inbox.</p>
          </div>
        )}

        {/* Messages List */}
        {fetched && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <article
                  key={msg.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    msg.is_read
                      ? "border-neutral-800 bg-neutral-950/95"
                      : "border-blue-800/60 bg-blue-950/10 ring-1 ring-blue-800/30"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div 
                      className="flex-1 cursor-pointer" 
                      onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {!msg.is_read && (
                          <span className="size-2 shrink-0 rounded-full bg-blue-400" />
                        )}
                        <h3 className={`text-sm font-semibold ${msg.is_read ? "text-neutral-300" : "text-white"}`}>
                          {msg.subject || "No Subject"}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        From: <span className="text-neutral-200">{msg.name}</span> 
                        <span className="text-neutral-600"> ({msg.email})</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        msg.is_read ? "bg-neutral-800 text-neutral-400" : "bg-blue-900/60 text-blue-300"
                      }`}>
                        {msg.is_read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>

                  {/* Message Preview / Expanded Content */}
                  <div className="mt-3">
                    {isExpanded ? (
                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                        {msg.message}
                      </p>
                    ) : (
                      <p className="line-clamp-2 text-sm text-neutral-500">
                        {msg.message}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-800 pt-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                      className="text-xs font-medium text-neutral-400 transition hover:text-white"
                    >
                      {isExpanded ? "Collapse" : "Read Full Message"}
                    </button>
                    
                    {canManage && (
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={() => toggleRead(msg.id, msg.is_read)}
                          className={btnEdit}
                        >
                          Mark as {msg.is_read ? "Unread" : "Read"}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your inquiry"}`}
                          className="rounded-full bg-blue-800 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-700"
                        >
                          Reply via Email
                        </a>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className={btnDanger}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </RBACGuard>
    </div>
  );
}
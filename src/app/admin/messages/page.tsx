"use client";

import { useState } from "react";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  async function fetchMessages() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/messages");

    if (!res.ok) {
      setError("Failed to fetch messages.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setMessages(data);
    setFetched(true);
    setLoading(false);
  }

  async function markRead(id: number) {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: true }),
    });

    if (!res.ok) {
      setActionMsg("Failed to mark as read.");
      return;
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  }

  async function deleteMessage(id: number) {
    const res = await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      setActionMsg("Failed to delete message.");
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== id));
    setActionMsg("Message deleted.");
    setTimeout(() => setActionMsg(null), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Contact Messages
        </h1>
        <p className="text-sm text-neutral-400">
          Submissions from the public contact form, managed by the Office of Public
          Affairs (Constitution Article 8, Section 11).
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {actionMsg && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-400">
          {actionMsg}
        </div>
      )}

      {/* Load Button */}
      {!fetched && (
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Messages"}
        </button>
      )}

      {/* Messages List */}
      {fetched && messages.length === 0 && (
        <p className="text-sm text-neutral-500">No messages found.</p>
      )}

      {fetched && messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg) => (
            <article
              key={msg.id}
              className={`rounded-3xl border p-6 shadow-lg shadow-black/20 ${
                msg.is_read
                  ? "border-neutral-800 bg-neutral-950/95"
                  : "border-neutral-700 bg-neutral-900/95"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {msg.name}
                    </h3>
                    {msg.is_read ? (
                      <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-400">
                        Read
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-900/60 px-2.5 py-1 text-xs font-semibold text-amber-300">
                        Unread
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-neutral-400 sm:grid-cols-2">
                    <p>Email: <span className="text-neutral-300">{msg.email}</span></p>
                    <p>Received: <span className="text-neutral-300">{new Date(msg.created_at).toLocaleDateString()}</span></p>
                  </div>
                  <p className="text-sm font-medium text-neutral-300">
                    Subject: {msg.subject}
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    {msg.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  {!msg.is_read && (
                    <button
                      onClick={() => markRead(msg.id)}
                      className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-700"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="rounded-full bg-red-800/60 px-4 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

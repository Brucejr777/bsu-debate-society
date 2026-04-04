// Auth helpers that work in both Edge (middleware) and Node (server actions)

export function createSessionCookie(): string {
  const random = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  return `${random}:${expires}`;
}

export function isValidSession(raw: string | undefined): boolean {
  if (!raw) return false;
  const parts = raw.split(":");
  if (parts.length < 2) return false;
  const expires = parseInt(parts[parts.length - 1], 10);
  if (isNaN(expires)) return false;
  return Date.now() <= expires;
}

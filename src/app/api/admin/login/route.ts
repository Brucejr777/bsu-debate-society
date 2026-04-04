import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createSessionCookie } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function hashPassword(password: string, saltHex: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 310000,
      hash: "SHA-256",
    },
    keyMaterial,
    512
  );
  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedHash) {
    return NextResponse.json(
      { error: "Admin password not configured." },
      { status: 500 }
    );
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const [salt, hash] = expectedHash.split(":");
  const inputHash = await hashPassword(password, salt);

  if (inputHash !== hash) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const session = createSessionCookie();
  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

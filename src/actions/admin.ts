"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionCookie } from "@/lib/auth";

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

export async function verifyPassword(input: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  const inputHash = await hashPassword(input, salt);
  return inputHash === hash;
}

export async function adminLogin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password") as string;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedHash) {
    return { error: "Admin password not configured. Contact the site administrator." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  const isCorrect = await verifyPassword(password, expectedHash);
  if (!isCorrect) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  const session = createSessionCookie();

  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

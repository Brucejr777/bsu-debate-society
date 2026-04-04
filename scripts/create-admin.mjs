// Creates an admin user in Supabase Auth.
// Run: node scripts/create-admin.mjs
//
// Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// The SERVICE ROLE key bypasses RLS — get it from Supabase Dashboard > Project Settings > API
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY in .env.local");
  console.error(
    "Get it from: Supabase Dashboard → Project Settings → API → service_role key"
  );
  process.exit(1);
}

const EMAIL = "admin@bsu-debate-society.org"; // ← change if needed
const PASSWORD = "YourStrongPassword123!"; // ← change if needed

const supabase = createClient(supabaseUrl, serviceKey);

const { data, error } = await supabase.auth.admin.createUser({
  email: EMAIL,
  password: PASSWORD,
  email_confirm: true,
});

if (error) {
  console.error("Failed to create user:", error);
  process.exit(1);
}

console.log(`User created: ${data.user.email}`);
console.log(`ID: ${data.user.id}`);

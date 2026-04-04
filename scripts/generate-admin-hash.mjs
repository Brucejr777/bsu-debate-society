// Generate a password hash compatible with Web Crypto API (PBKDF2-SHA256)
// Run: node scripts/generate-admin-hash.mjs <your-password>

import crypto from "node:crypto";

const PASSWORD = process.argv[2];
if (!PASSWORD) {
  console.error("Usage: node scripts/generate-admin-hash.mjs <your-password>");
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(PASSWORD, salt, 310000, 64, "sha256");

const saltHex = salt.toString("hex");
const hashHex = hash.toString("hex");

console.log(`ADMIN_PASSWORD_HASH=${saltHex}:${hashHex}`);

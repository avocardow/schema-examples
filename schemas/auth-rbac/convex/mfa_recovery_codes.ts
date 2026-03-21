// mfa_recovery_codes: Backup codes for when a user loses access to their MFA device.
// Each code is a separate row so individual consumption can be tracked.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mfaRecoveryCodes = defineTable({
  userId: v.id("users"),
  codeHash: v.string(), // Hashed recovery code. Plaintext shown once at generation, never again.
  usedAt: v.optional(v.number()), // Null = available. Set when consumed.
})
  .index("by_user_id", ["userId"]);

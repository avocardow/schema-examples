// verification_tokens: Unified table for all one-time tokens (email verification,
// password reset, magic links, phone verification, invitations).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const verificationTokens = defineTable({
  userId: v.optional(v.id("users")), // Nullable because some tokens exist before a user record.
  tokenHash: v.string(), // SHA-256 hash. Never store raw tokens.

  type: v.union(
    v.literal("email_verification"),
    v.literal("phone_verification"),
    v.literal("password_reset"),
    v.literal("magic_link"),
    v.literal("invitation"),
  ),

  identifier: v.string(), // The email or phone number this token targets.
  expiresAt: v.number(),
  usedAt: v.optional(v.number()), // Set when consumed. Prevents replay attacks.
})
  .index("by_token_hash", ["tokenHash"])
  .index("by_identifier_type", ["identifier", "type"])
  .index("by_expires_at", ["expiresAt"]);

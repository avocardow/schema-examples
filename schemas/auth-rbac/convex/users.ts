// users: Central identity record. One row per human (or anonymous) user.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  email: v.optional(v.string()), // Always store lowercase. Nullable for anonymous or phone-only users.
  emailVerifiedAt: v.optional(v.number()), // Timestamp of verification.
  phone: v.optional(v.string()), // E.164 format (e.g., "+15551234567").
  phoneVerifiedAt: v.optional(v.number()),
  name: v.optional(v.string()), // Display name. Not used for auth.
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  username: v.optional(v.string()),
  imageUrl: v.optional(v.string()),

  isAnonymous: v.boolean(), // Guest users that can upgrade to full accounts.

  // Ban = admin decision (ToS violation). Lock = automated (brute-force protection).
  banned: v.boolean(),
  bannedReason: v.optional(v.string()),
  bannedUntil: v.optional(v.number()), // Null = permanent ban.
  locked: v.boolean(),
  lockedUntil: v.optional(v.number()), // Auto-unlock after this time.
  failedLoginAttempts: v.number(), // Reset to 0 on successful login.
  lastFailedLoginAt: v.optional(v.number()),

  // Two-tier metadata prevents privilege escalation via client-side manipulation.
  publicMetadata: v.optional(v.any()), // Client-readable, server-writable (preferences, theme).
  privateMetadata: v.optional(v.any()), // Server-only (Stripe ID, internal notes). Never expose to client.

  externalId: v.optional(v.string()), // Link to external system (legacy DB, CRM).
  lastSignInAt: v.optional(v.number()),
  lastSignInIp: v.optional(v.string()), // Consider privacy regulations before storing.
  signInCount: v.number(),

  updatedAt: v.number(),
  deletedAt: v.optional(v.number()), // Soft delete for audit trails.
})
  .index("by_email", ["email"])
  .index("by_phone", ["phone"])
  .index("by_username", ["username"])
  .index("by_external_id", ["externalId"])
  .index("by_creation_time", ["_creationTime"]);

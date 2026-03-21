// sessions: Active login sessions. Tracks *how* the user authenticated, not just *that* they did.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const sessions = defineTable({
  userId: v.id("users"),
  tokenHash: v.string(), // SHA-256 hash. Never store raw session tokens.

  // Authentication Assurance Level: aal1 = password/OAuth, aal2 = MFA verified, aal3 = hardware key.
  aal: v.union(v.literal("aal1"), v.literal("aal2"), v.literal("aal3")),

  mfaFactorId: v.optional(v.id("mfa_factors")), // Which MFA factor elevated this session to aal2+.
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  countryCode: v.optional(v.string()), // ISO 3166-1 alpha-2, derived from IP.

  organizationId: v.optional(v.id("organizations")), // Active org context for multi-tenant apps.
  impersonatorId: v.optional(v.id("users")), // Set when an admin is impersonating this user.

  tag: v.optional(v.string()), // Custom label (e.g., "mobile", "api").
  lastActiveAt: v.optional(v.number()),
  expiresAt: v.number(), // Hard expiry.
})
  .index("by_user_id", ["userId"])
  .index("by_token_hash", ["tokenHash"])
  .index("by_expires_at", ["expiresAt"]);

// api_keys: Long-lived API keys for programmatic access.
// The key itself is shown once at creation -- after that, only the hash is stored.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const apiKeys = defineTable({
  userId: v.optional(v.id("users")), // Null for org-level keys.
  organizationId: v.optional(v.id("organizations")), // Null for personal keys.
  name: v.string(), // User-assigned label (e.g., "CI/CD Pipeline").
  keyPrefix: v.string(), // First 8 chars for identification (e.g., "sk_live_Ab").
  keyHash: v.string(), // SHA-256 hash of the full key.

  scopes: v.optional(v.array(v.string())), // e.g., ["read:users", "write:posts"].

  lastUsedAt: v.optional(v.number()),
  lastUsedIp: v.optional(v.string()),
  expiresAt: v.optional(v.number()), // Null = never expires.
  revokedAt: v.optional(v.number()), // Null = active. Set to revoke without deleting.
  updatedAt: v.number(),
})
  .index("by_key_hash", ["keyHash"])
  .index("by_user_id", ["userId"])
  .index("by_organization_id", ["organizationId"]);

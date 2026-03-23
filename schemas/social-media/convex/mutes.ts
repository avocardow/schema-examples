// mutes: temporary or permanent muting of users with optional expiration.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mutes = defineTable({
  muterId: v.id("users"),
  mutedId: v.id("users"),
  expiresAt: v.optional(v.number()),
})
  .index("by_muter_id_muted_id", ["muterId", "mutedId"])
  .index("by_muted_id", ["mutedId"])
  .index("by_expires_at", ["expiresAt"]);

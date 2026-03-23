// user_presence: Online/offline status and custom status for users.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userPresence = defineTable({
  userId: v.id("users"),
  status: v.union(
    v.literal("online"),
    v.literal("away"),
    v.literal("busy"),
    v.literal("offline")
  ),
  statusText: v.optional(v.string()),
  statusEmoji: v.optional(v.string()),
  lastActiveAt: v.optional(v.number()),
  lastConnectedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"])
  .index("by_last_active_at", ["lastActiveAt"]);

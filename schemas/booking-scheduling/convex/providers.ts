// providers: individuals who deliver services and manage their own availability.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const providers = defineTable({
  userId: v.id("users"),
  displayName: v.string(),
  bio: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  timezone: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  isActive: v.boolean(),
  isAccepting: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_is_active_is_accepting", ["isActive", "isAccepting"])
  .index("by_is_active_position", ["isActive", "position"]);

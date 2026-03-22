// strikes: Accumulated violations with configurable expiry.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const strikes = defineTable({
  // Foreign keys
  userId: v.id("users"), // The user who received the strike. Cascade: if user is deleted, their strikes are removed.
  moderationActionId: v.id("moderation_actions"), // The action that generated this strike. Restrict: cannot delete an action that has a strike record.
  violationCategoryId: v.optional(v.id("violation_categories")), // What type of violation the strike is for.

  // Required fields
  severity: v.union(v.literal("minor"), v.literal("moderate"), v.literal("severe")), // Strike weight. Severe strikes may count as 2 or 3.
  isActive: v.boolean(), // Whether this strike is currently counting. False = expired or overturned on appeal.
  resolution: v.union(v.literal("active"), v.literal("expired"), v.literal("appealed_overturned")),

  // Timestamps
  issuedAt: v.number(), // Unix epoch ms.
  expiresAt: v.optional(v.number()), // Unix epoch ms. Null = never expires.
  // no createdAt — Convex provides _creationTime
  // no updatedAt — not in pseudo schema
})
  .index("by_user_id_is_active", ["userId", "isActive"])
  .index("by_moderation_action_id", ["moderationActionId"])
  .index("by_violation_category_id", ["violationCategoryId"])
  .index("by_expires_at_is_active", ["expiresAt", "isActive"])
  .index("by_resolution", ["resolution"]);

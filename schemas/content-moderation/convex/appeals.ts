// appeals: User appeals against moderation actions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const appeals = defineTable({
  // Foreign keys
  moderationActionId: v.id("moderation_actions"), // The action being appealed. Restrict: cannot delete an action that has an active appeal.
  appellantId: v.id("users"), // Who submitted the appeal. Cascade: if user is deleted, their appeals are removed.

  // Required fields
  appealText: v.string(), // The user's explanation of why the action should be overturned.
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected"),
  ), // pending = awaiting review. approved = action overturned. rejected = action upheld.

  // Optional fields
  reviewerId: v.optional(v.id("users")), // Moderator who reviewed the appeal. Null = pending.
  reviewerNotes: v.optional(v.string()), // Internal notes on the appeal decision.
  reviewedAt: v.optional(v.number()), // Unix epoch ms. When the appeal was decided. Null = pending.

  // no createdAt — Convex provides _creationTime
  // no updatedAt — appeals follow a one-way state machine
})
  .index("by_moderation_action_id", ["moderationActionId"])
  .index("by_appellant_id", ["appellantId"])
  .index("by_status", ["status"])
  .index("by_reviewer_id", ["reviewerId"]);

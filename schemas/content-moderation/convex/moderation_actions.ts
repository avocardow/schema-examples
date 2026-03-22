// moderation_actions: Enforcement actions taken by moderators or automated systems.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderation_actions = defineTable({
  // Foreign keys
  queueItemId: v.optional(v.id("moderation_queue_items")), // The queue item that prompted this action. Null = proactive action not from queue.
  moderatorId: v.optional(v.id("users")), // Who took this action. Null = automated action.
  violationCategoryId: v.optional(v.id("violation_categories")), // What policy category was violated.
  responseTemplateId: v.optional(v.id("response_templates")), // Canned response used, if any.

  // Required fields
  actionType: v.union(
    v.literal("approve"),
    v.literal("remove"),
    v.literal("warn"),
    v.literal("mute"),
    v.literal("ban"),
    v.literal("restrict"),
    v.literal("escalate"),
    v.literal("label"),
  ),
  targetType: v.union(
    v.literal("content"),
    v.literal("user"),
    v.literal("account"),
  ),
  targetId: v.string(), // ID of the action target. String for external ID support.
  isAutomated: v.boolean(), // Whether this action was taken by an automated system.

  // Optional fields
  reason: v.optional(v.string()), // Moderator's explanation of why this action was taken.
  metadata: v.optional(v.any()), // Action-specific details (e.g., ban duration, removal visibility, label text).
  // no createdAt — Convex provides _creationTime
  // no updatedAt — actions are immutable
})
  .index("by_queue_item_id", ["queueItemId"])
  .index("by_moderator_id", ["moderatorId"])
  .index("by_action_type", ["actionType"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_violation_category_id", ["violationCategoryId"])
  .index("by_is_automated", ["isAutomated"])
  .index("by_creation_time", ["_creationTime"]);

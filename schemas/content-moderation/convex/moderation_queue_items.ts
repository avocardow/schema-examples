// moderation_queue_items: Central moderation queue for content review.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderation_queue_items = defineTable({
  // Core classification
  contentType: v.union(
    v.literal("post"),
    v.literal("comment"),
    v.literal("message"),
    v.literal("user"),
    v.literal("media")
  ), // What type of content is being reviewed.
  contentId: v.string(), // ID of the flagged content. String, not UUID — supports external ID formats.

  source: v.union(
    v.literal("user_report"),
    v.literal("auto_detection"),
    v.literal("manual")
  ), // How this item entered the queue.

  status: v.union(
    v.literal("pending"),
    v.literal("in_review"),
    v.literal("resolved"),
    v.literal("escalated")
  ), // pending → in_review → resolved|escalated.

  priority: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high"),
    v.literal("critical")
  ), // Queue ordering. Critical = illegal content, imminent harm.

  // Foreign keys
  assignedModeratorId: v.optional(v.id("users")), // Moderator currently reviewing this item. Null = unassigned.
  resolvedBy: v.optional(v.id("users")), // Moderator who resolved this item.

  // Content evidence
  contentSnapshot: v.optional(v.any()), // Frozen copy of content at time of flagging. Structure depends on contentType.

  // Denormalized
  reportCount: v.number(), // Number of user reports linked to this item. Denormalized for queue sorting.

  // Resolution
  resolution: v.optional(
    v.union(
      v.literal("approved"),
      v.literal("removed"),
      v.literal("escalated")
    )
  ), // Final outcome. Null = not yet resolved.

  resolvedAt: v.optional(v.number()), // When the item was resolved. Null = still open.

  // Timestamps (only updatedAt — createdAt is auto via _creationTime)
  updatedAt: v.number(),
})
  .index("by_status_priority_creation", ["status", "priority", "_creationTime"])
  .index("by_content", ["contentType", "contentId"])
  .index("by_assigned_moderator", ["assignedModeratorId"])
  .index("by_source", ["source"])
  .index("by_status", ["status"])
  .index("by_resolved_at", ["resolvedAt"]);

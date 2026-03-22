// reports: User-submitted content reports.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reports = defineTable({
  // Foreign keys
  reporterId: v.id("users"), // Who submitted this report. Cascade: if reporter is deleted, their reports are removed.

  // Required fields
  contentType: v.union(
    v.literal("post"),
    v.literal("comment"),
    v.literal("message"),
    v.literal("user"),
    v.literal("media"),
  ), // What type of content is being reported.
  contentId: v.string(), // ID of the reported content. String for external ID support.
  category: v.union(
    v.literal("spam"),
    v.literal("harassment"),
    v.literal("hate_speech"),
    v.literal("violence"),
    v.literal("sexual_content"),
    v.literal("illegal"),
    v.literal("misinformation"),
    v.literal("self_harm"),
    v.literal("other"),
  ), // Reporter-selected reason category.
  status: v.union(
    v.literal("pending"),
    v.literal("reviewed"),
    v.literal("dismissed"),
  ), // pending = not yet reviewed. reviewed = moderator took action. dismissed = no violation found.

  // Optional fields
  queueItemId: v.optional(v.id("moderation_queue_items")), // The queue item this report is linked to. Set null: if queue item is deleted, report preserves history.
  reasonText: v.optional(v.string()), // Free-text explanation from the reporter.
  policyId: v.optional(v.id("moderation_policies")), // Which specific policy the reporter believes was violated. Set null: if policy is deleted, report preserves history.

  // no createdAt — Convex provides _creationTime
  // no updatedAt — reports are append-only
})
  .index("by_queue_item_id", ["queueItemId"])
  .index("by_reporter_id", ["reporterId"])
  .index("by_content", ["contentType", "contentId"])
  .index("by_status", ["status"])
  .index("by_category", ["category"])
  .index("by_creation_time", ["_creationTime"]);

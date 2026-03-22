// translation_reviews: Formal review records. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_reviews = defineTable({
  translationType: v.string(),
  translationId: v.string(), // Polymorphic — could reference different tables.
  reviewerId: v.id("users"),
  action: v.union(
    v.literal("approve"),
    v.literal("reject"),
    v.literal("request_changes")
  ),
  comment: v.optional(v.string()),

  // No updatedAt — append-only.
  // No createdAt — Convex provides _creationTime.
})
  .index("by_translation", ["translationType", "translationId"])
  .index("by_reviewer_id", ["reviewerId"]);

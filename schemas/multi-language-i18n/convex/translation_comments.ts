// translation_comments: Threaded discussion on translations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_comments = defineTable({
  translationType: v.string(),
  translationId: v.string(), // Polymorphic — could reference different tables.
  parentId: v.optional(v.id("translation_comments")),
  authorId: v.id("users"),
  body: v.string(),
  issueType: v.optional(v.string()),
  isResolved: v.boolean(), // Default false.
  updatedAt: v.number(),
})
  .index("by_translation", ["translationType", "translationId"])
  .index("by_parent_id", ["parentId"])
  .index("by_author_id", ["authorId"]);

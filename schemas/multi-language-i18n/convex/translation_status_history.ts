// translation_status_history: Audit trail for status changes. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_status_history = defineTable({
  translationType: v.string(),
  translationId: v.string(), // Polymorphic — could reference different tables.
  fromStatus: v.optional(v.string()),
  toStatus: v.string(),
  changedBy: v.optional(v.id("users")),
  comment: v.optional(v.string()),

  // No updatedAt — append-only.
  // No createdAt — Convex provides _creationTime.
})
  .index("by_translation", ["translationType", "translationId"])
  .index("by_changed_by", ["changedBy"]);

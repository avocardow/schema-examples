// report_notes: Internal moderator notes on queue items.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const report_notes = defineTable({
  queueItemId: v.id("moderation_queue_items"), // The queue item this note is attached to. Cascade: deleting a queue item removes all its notes.
  moderatorId: v.id("users"), // Who wrote this note. Restrict: don't delete moderators who have notes.
  content: v.string(), // The note text. Internal-only, never shown to the reported user.
  // Append-only: notes are never edited. No updatedAt.
  // no createdAt — Convex provides _creationTime
})
  .index("by_queue_item_id", ["queueItemId"])
  .index("by_moderator_id", ["moderatorId"]);

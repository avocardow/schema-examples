// notification_threads: Thread-level state for grouping related notifications. Per-thread read tracking, metadata, and efficient "threads with unread" queries.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_threads = defineTable({
  threadKey: v.string(), // e.g., "issue:456", "pr:789". Must match the thread_key on events.

  // Thread metadata: displayed in the thread list UI.
  title: v.optional(v.string()), // e.g., "Fix login bug (#456)". Can be updated as the thread evolves.
  icon: v.optional(v.string()), // Icon URL or icon identifier for the thread.
  categoryId: v.optional(v.id("notification_categories")), // Associate the thread with a category for filtering.

  // Counter cache: avoids COUNT(*) on every thread list render.
  notificationCount: v.number(), // Default 0. Updated by your app when notifications are created.

  lastActivityAt: v.optional(v.number()), // When the most recent event in this thread occurred. For sorting threads.
  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_thread_key", ["threadKey"])
  .index("by_category_id", ["categoryId"])
  .index("by_last_activity_at", ["lastActivityAt"]);

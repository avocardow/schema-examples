// event_updates: announcements and news posts published to event attendees.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_updates = defineTable({
  eventId: v.id("events"),
  authorId: v.id("users"),
  title: v.string(),
  body: v.string(),
  isPublished: v.boolean(),
  isPinned: v.boolean(),
  publishedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_event_id_is_published_published_at", ["eventId", "isPublished", "publishedAt"])
  .index("by_author_id", ["authorId"]);

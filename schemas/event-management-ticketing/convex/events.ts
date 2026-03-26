// events: core event records with scheduling, visibility, and registration details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const events = defineTable({
  seriesId: v.optional(v.id("event_series")),
  categoryId: v.optional(v.id("event_categories")),
  venueId: v.optional(v.id("venues")),
  title: v.string(),
  slug: v.string(),
  summary: v.optional(v.string()),
  description: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  startTime: v.number(),
  endTime: v.number(),
  timezone: v.string(),
  isAllDay: v.boolean(),
  maxAttendees: v.optional(v.number()),
  status: v.union(
    v.literal("draft"),
    v.literal("published"),
    v.literal("cancelled"),
    v.literal("postponed"),
    v.literal("completed")
  ),
  visibility: v.union(
    v.literal("public"),
    v.literal("private"),
    v.literal("unlisted")
  ),
  registrationOpenAt: v.optional(v.number()),
  registrationCloseAt: v.optional(v.number()),
  isFree: v.boolean(),
  contactEmail: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_series_id", ["seriesId"])
  .index("by_category_id", ["categoryId"])
  .index("by_venue_id", ["venueId"])
  .index("by_status_start_time", ["status", "startTime"])
  .index("by_visibility", ["visibility"])
  .index("by_start_time_end_time", ["startTime", "endTime"])
  .index("by_created_by", ["createdBy"]);

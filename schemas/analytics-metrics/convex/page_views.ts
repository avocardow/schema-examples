// page_views: Dedicated page view tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const page_views = defineTable({
  eventId: v.optional(v.id("events")),
  userId: v.optional(v.id("users")),
  anonymousId: v.optional(v.string()),
  sessionId: v.optional(v.id("sessions")),
  url: v.string(),
  path: v.string(),
  title: v.optional(v.string()),
  referrer: v.optional(v.string()),
  hostname: v.string(),
  viewportWidth: v.optional(v.number()),
  viewportHeight: v.optional(v.number()),
  screenWidth: v.optional(v.number()),
  screenHeight: v.optional(v.number()),
  duration: v.optional(v.number()),
  timestamp: v.number(),
})
  .index("by_user_id_and_timestamp", ["userId", "timestamp"])
  .index("by_session_id", ["sessionId"])
  .index("by_path", ["path"])
  .index("by_hostname_and_path", ["hostname", "path"])
  .index("by_timestamp", ["timestamp"])
  .index("by_anonymous_id", ["anonymousId"]);

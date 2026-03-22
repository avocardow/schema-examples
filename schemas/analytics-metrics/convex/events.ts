// events: Append-only event log.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const events = defineTable({
  eventTypeId: v.id("event_types"),
  userId: v.optional(v.id("users")),
  anonymousId: v.optional(v.string()),
  sessionId: v.optional(v.id("sessions")),
  timestamp: v.number(),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  deviceType: v.optional(v.string()),
  os: v.optional(v.string()),
  browser: v.optional(v.string()),
  country: v.optional(v.string()),
  region: v.optional(v.string()),
  city: v.optional(v.string()),
  locale: v.optional(v.string()),
  referrer: v.optional(v.string()),
  campaignId: v.optional(v.id("campaigns")),
  properties: v.optional(v.any()),
})
  .index("by_event_type_id", ["eventTypeId"])
  .index("by_user_id_and_timestamp", ["userId", "timestamp"])
  .index("by_session_id", ["sessionId"])
  .index("by_timestamp", ["timestamp"])
  .index("by_campaign_id", ["campaignId"])
  .index("by_anonymous_id", ["anonymousId"])
  .index("by_country", ["country"]);

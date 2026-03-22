// sessions: User sessions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const sessions = defineTable({
  userId: v.optional(v.id("users")),
  anonymousId: v.optional(v.string()),
  startedAt: v.number(),
  endedAt: v.optional(v.number()),
  duration: v.optional(v.number()),
  pageCount: v.number(),
  eventCount: v.number(),
  isBounce: v.boolean(),
  entryUrl: v.optional(v.string()),
  exitUrl: v.optional(v.string()),
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
  updatedAt: v.number(),
})
  .index("by_user_id_and_started_at", ["userId", "startedAt"])
  .index("by_anonymous_id", ["anonymousId"])
  .index("by_started_at", ["startedAt"])
  .index("by_campaign_id", ["campaignId"])
  .index("by_country", ["country"])
  .index("by_is_bounce", ["isBounce"]);

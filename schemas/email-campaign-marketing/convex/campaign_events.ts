// campaign_events: Tracks engagement events (opens, clicks, bounces, etc.) for campaign sends.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaignEvents = defineTable({
  sendId: v.id("campaignSends"),
  eventType: v.union(
    v.literal("open"),
    v.literal("click"),
    v.literal("bounce"),
    v.literal("complaint"),
    v.literal("unsubscribe")
  ),
  linkId: v.optional(v.id("campaignLinks")),
  metadata: v.optional(v.any()),
  occurredAt: v.number(),
})
  .index("by_send_id", ["sendId"])
  .index("by_event_type", ["eventType"])
  .index("by_occurred_at", ["occurredAt"]);

// campaign_sends: Individual send records tracking delivery status per contact per campaign.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaignSends = defineTable({
  campaignId: v.id("campaigns"),
  contactId: v.id("contacts"),
  status: v.union(
    v.literal("queued"),
    v.literal("sent"),
    v.literal("delivered"),
    v.literal("bounced"),
    v.literal("dropped"),
    v.literal("deferred")
  ),
  sentAt: v.optional(v.number()),
  deliveredAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_campaign_id_contact_id", ["campaignId", "contactId"])
  .index("by_contact_id", ["contactId"])
  .index("by_status", ["status"])
  .index("by_sent_at", ["sentAt"]);

// campaigns: Email campaigns with scheduling, A/B testing, and send status tracking.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaigns = defineTable({
  name: v.string(),
  subject: v.optional(v.string()),
  fromName: v.optional(v.string()),
  fromEmail: v.optional(v.string()),
  replyTo: v.optional(v.string()),
  templateId: v.optional(v.id("templates")),
  htmlBody: v.optional(v.string()),
  textBody: v.optional(v.string()),
  status: v.union(
    v.literal("draft"),
    v.literal("scheduled"),
    v.literal("sending"),
    v.literal("paused"),
    v.literal("cancelled"),
    v.literal("sent")
  ),
  campaignType: v.union(v.literal("regular"), v.literal("ab_test")),
  scheduledAt: v.optional(v.number()),
  sentAt: v.optional(v.number()),
  abTestWinnerId: v.optional(v.id("campaigns")),
  abTestSamplePct: v.optional(v.number()),
  abTestMetric: v.optional(
    v.union(v.literal("open_rate"), v.literal("click_rate"))
  ),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_campaign_type", ["campaignType"])
  .index("by_template_id", ["templateId"])
  .index("by_scheduled_at", ["scheduledAt"])
  .index("by_creation_time", ["_creationTime"]);

// message_reports: User-submitted reports for message moderation.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  messageId: v.id("messages"),
  reporterId: v.id("users"),
  reason: v.union(
    v.literal("spam"),
    v.literal("harassment"),
    v.literal("hate_speech"),
    v.literal("violence"),
    v.literal("misinformation"),
    v.literal("nsfw"),
    v.literal("other")
  ),
  description: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("reviewed"),
    v.literal("resolved"),
    v.literal("dismissed")
  ),
  reviewedBy: v.optional(v.id("users")),
  reviewedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_message_id", ["messageId"])
  .index("by_reporter_id", ["reporterId"])
  .index("by_reviewed_by", ["reviewedBy"])
  .index("by_message_id_and_reporter_id", ["messageId", "reporterId"]);

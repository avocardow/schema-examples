// post_reports: user-submitted reports on posts for moderation review.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postReports = defineTable({
  postId: v.id("posts"),
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
  .index("by_post_id_reporter_id", ["postId", "reporterId"])
  .index("by_status", ["status"])
  .index("by_reporter_id", ["reporterId"])
  .index("by_reviewed_by", ["reviewedBy"]);

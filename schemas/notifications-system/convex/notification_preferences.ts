// notification_preferences: Per-user opt-in/opt-out controls across the category × channel matrix.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_preferences = defineTable({
  userId: v.id("users"),

  // Null = global preference (applies to all categories without a specific override).
  categoryId: v.optional(v.id("notification_categories")),

  // Null = all channels (applies to all channels without a specific override).
  channelType: v.optional(
    v.union(
      v.literal("email"),
      v.literal("sms"),
      v.literal("push"),
      v.literal("in_app"),
      v.literal("chat"),
      v.literal("webhook"),
    ),
  ),

  // true = opted in, false = opted out. Does NOT override is_required categories.
  enabled: v.boolean(),

  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_user_id_category_id", ["userId", "categoryId"])
  .index("by_user_id_category_id_channel_type", [
    "userId",
    "categoryId",
    "channelType",
  ]);

// notification_subscriptions: Links users to topics with optional per-channel granularity.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_subscriptions = defineTable({
  userId: v.id("users"),
  topicId: v.id("notification_topics"),

  // Which channel this subscription applies to. Null = subscribed on all channels.
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
})
  .index("by_topic_id", ["topicId"])
  .index("by_user_id", ["userId"])
  .index("by_user_topic_channel", ["userId", "topicId", "channelType"]);

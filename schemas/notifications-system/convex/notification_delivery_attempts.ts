// notification_delivery_attempts: Per-notification, per-channel delivery attempt log with full audit trail and retry tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_delivery_attempts = defineTable({
  notificationId: v.id("notifications"),
  channelId: v.id("notification_channels"),

  // Delivery lifecycle. Mutually exclusive, progresses forward.
  status: v.union(
    v.literal("pending"),
    v.literal("queued"),
    v.literal("sent"),
    v.literal("delivered"),
    v.literal("bounced"),
    v.literal("failed")
  ),

  providerMessageId: v.optional(v.string()), // e.g., SendGrid's "X-Message-Id", Twilio's "SM..." SID.
  providerResponse: v.optional(v.any()), // Raw provider response for debugging.

  errorCode: v.optional(v.string()), // Provider-specific error code.
  errorMessage: v.optional(v.string()), // Human-readable error description.

  attemptNumber: v.number(), // Which attempt this is (1 = first try, 2 = first retry, etc.).
  nextRetryAt: v.optional(v.number()), // When the next retry is scheduled. Null = no retry planned.

  sentAt: v.optional(v.number()), // When the provider accepted the request.
  deliveredAt: v.optional(v.number()), // When delivery was confirmed (from provider webhook).
  updatedAt: v.number(), // Tracks the latest status transition.
})
  .index("by_notification_id", ["notificationId"])
  .index("by_channel_id_status", ["channelId", "status"])
  .index("by_provider_message_id", ["providerMessageId"])
  .index("by_status_next_retry_at", ["status", "nextRetryAt"])
  .index("by_creation_time", ["_creationTime"]);

// notification_channels: Configured delivery provider instances (e.g., "SendGrid for production email").
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_channels = defineTable({
  // What type of delivery channel this provider serves.
  channelType: v.union(
    v.literal("email"),
    v.literal("sms"),
    v.literal("push"),
    v.literal("in_app"),
    v.literal("chat"),
    v.literal("webhook")
  ),

  // Which third-party provider powers this channel (e.g., 'sendgrid', 'twilio', 'fcm', 'slack', 'custom').
  provider: v.string(),
  name: v.string(), // Display name (e.g., "SendGrid Production", "Twilio SMS").

  // ⚠️  Provider credentials MUST be encrypted at rest.
  credentials: v.any(),

  isActive: v.boolean(), // Toggle a provider on/off without deleting its configuration.
  isPrimary: v.boolean(), // Only one channel per channel_type should be primary.
  priority: v.number(), // Failover priority: lower number = higher priority.

  // Provider-specific configuration that doesn't fit in credentials.
  config: v.optional(v.any()),

  updatedAt: v.number(),
})
  .index("by_channel_type_is_active", ["channelType", "isActive"])
  .index("by_channel_type_is_primary", ["channelType", "isPrimary"])
  .index("by_channel_type_priority", ["channelType", "priority"]);

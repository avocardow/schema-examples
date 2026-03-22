// notification_template_contents: Per-channel content variants for a template (email, SMS, push, in-app, etc.).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

const channelType = v.union(
  v.literal("email"),
  v.literal("sms"),
  v.literal("push"),
  v.literal("in_app"),
  v.literal("chat"),
  v.literal("webhook"),
);

export const notification_template_contents = defineTable({
  templateId: v.id("notification_templates"),

  channelType: channelType, // Which channel this content is for.

  subject: v.optional(v.string()), // Email subject, push title. Not applicable for SMS or webhook.
  body: v.string(), // The main content. HTML for email, plain text for SMS, structured for in-app.

  // Channel-specific metadata (provider-specific fields like preheader, icon, sound, etc.).
  metadata: v.optional(v.any()),

  updatedAt: v.number(),
})
  .index("by_template_id", ["templateId"])
  .index("by_template_id_channel_type", ["templateId", "channelType"]);

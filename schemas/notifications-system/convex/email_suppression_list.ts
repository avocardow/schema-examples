// email_suppression_list: Email addresses that should not be sent to. Prevents bounces, spam complaints, and unsubscribe violations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const email_suppression_list = defineTable({
  email: v.string(), // Lowercase, trimmed.

  // Why this address is suppressed.
  reason: v.union(
    v.literal("hard_bounce"), // Mailbox doesn't exist (permanent). Never send again.
    v.literal("soft_bounce"), // Temporary delivery failure. May clear after a cooling period.
    v.literal("spam_complaint"), // Recipient marked your email as spam. Never send again.
    v.literal("manual_unsubscribe"), // User clicked unsubscribe link. Respect immediately.
    v.literal("invalid_address") // Address format is invalid or domain doesn't exist.
  ),

  // How this suppression was created.
  source: v.union(
    v.literal("provider_webhook"), // Bounce/complaint webhook from SendGrid, Postmark, etc.
    v.literal("user_action"), // User clicked unsubscribe link in your app.
    v.literal("admin"), // Manually added by an admin.
    v.literal("system") // Automated detection (e.g., repeated soft bounces promoted to hard bounce).
  ),

  channelId: v.optional(v.id("notification_channels")), // Which provider reported the suppression.

  details: v.optional(v.any()), // Provider-specific details for debugging (e.g., bounce_type, provider_message).

  suppressedAt: v.number(), // When the suppression took effect. May differ from _creationTime if back-dated.
  expiresAt: v.optional(v.number()), // Null = permanent suppression. Set for soft bounces that should be retried.
  // no createdAt — Convex provides _creationTime
})
  .index("by_email_reason", ["email", "reason"]) // unique(email, reason): one entry per email per reason.
  .index("by_email", ["email"]) // "Is this email suppressed?" (checked before every email delivery).
  .index("by_reason", ["reason"]) // "All hard bounces" (for reporting).
  .index("by_expires_at", ["expiresAt"]); // Cleanup job: remove expired soft bounce suppressions.

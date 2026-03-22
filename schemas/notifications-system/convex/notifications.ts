// notifications: Per-recipient notification record — one row per recipient per event.
// Tracks delivery status (provider-side) and engagement status (user-side) as separate concerns.
// Uses polymorphic recipient (not FKs) so notifications can target any entity type.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notifications = defineTable({
  eventId: v.id("notification_events"), // The event that triggered this notification. Cascade: if the event is deleted, its notifications go too.

  // Polymorphic recipient: who this notification is for.
  // Not FKs — recipients can be any entity type (user, team, organization, channel).
  recipientType: v.string(), // e.g., "user", "team", "organization".
  recipientId: v.string(), // The recipient's ID.

  // Why this person was notified (e.g., "mention", "assign", "review_requested", "subscription").
  reason: v.optional(v.string()),

  // Delivery status: mutually exclusive lifecycle progression.
  deliveryStatus: v.union(
    v.literal("pending"),
    v.literal("queued"),
    v.literal("sent"),
    v.literal("delivered"),
    v.literal("failed"),
    v.literal("canceled"),
  ),

  // Engagement status: nullable timestamps that can coexist.
  seenAt: v.optional(v.number()), // Appeared in the user's feed. Drives "unseen" badge count.
  readAt: v.optional(v.number()), // User explicitly opened/clicked. Null = unread.
  interactedAt: v.optional(v.number()), // User performed the notification's primary action.
  archivedAt: v.optional(v.number()), // Soft archive. Hidden from default feed but still queryable.

  expiresAt: v.optional(v.number()), // Unix epoch. Inherited from event or overridden per-notification.

  updatedAt: v.number(),
})
  .index("by_event_id", ["eventId"])
  .index("by_recipient_read", ["recipientType", "recipientId", "readAt"])
  .index("by_recipient_created", ["recipientType", "recipientId", "_creationTime"])
  .index("by_recipient_seen", ["recipientType", "recipientId", "seenAt"])
  .index("by_delivery_status", ["deliveryStatus"])
  .index("by_expires_at", ["expiresAt"]);

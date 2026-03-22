// notifications: Per-recipient notification record. One row per recipient per event.
// Tracks delivery status (provider) and engagement status (user) as separate concerns.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notificationEvents } from "./notification_events";

// Delivery lifecycle: pending → queued → sent → delivered | failed | canceled.
export const deliveryStatus = pgEnum("delivery_status", [
  "pending",
  "queued",
  "sent",
  "delivered",
  "failed",
  "canceled",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // The event that triggered this notification. Cascade: if the event is deleted, its notifications go too.
    eventId: uuid("event_id")
      .notNull()
      .references(() => notificationEvents.id, { onDelete: "cascade" }),

    // Polymorphic recipient: who this notification is for.
    // Can be a user, a team, an organization, a channel — any entity that has a notification inbox.
    recipientType: text("recipient_type").notNull(),
    recipientId: text("recipient_id").notNull(),

    // Why this person was notified (e.g., "mention", "assign", "review_requested").
    reason: text("reason"),

    // Delivery status: mutually exclusive, progresses through a lifecycle.
    deliveryStatus: deliveryStatus("delivery_status")
      .notNull()
      .default("pending"),

    // Engagement status: nullable timestamps that can coexist.
    seenAt: timestamp("seen_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    interactedAt: timestamp("interacted_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),

    // Expiration: inherited from the event or overridden per-notification.
    expiresAt: timestamp("expires_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notifications_event_id").on(table.eventId),
    index("idx_notifications_recipient_read").on(
      table.recipientType,
      table.recipientId,
      table.readAt
    ),
    index("idx_notifications_recipient_created").on(
      table.recipientType,
      table.recipientId,
      table.createdAt
    ),
    index("idx_notifications_recipient_seen").on(
      table.recipientType,
      table.recipientId,
      table.seenAt
    ),
    index("idx_notifications_delivery_status").on(table.deliveryStatus),
    index("idx_notifications_expires_at").on(table.expiresAt),
  ]
);

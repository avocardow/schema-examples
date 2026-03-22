// notification_delivery_attempts: Per-notification, per-channel delivery attempt log with full audit trail and retry tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notifications } from "./notifications";
import { notificationChannels } from "./notification_channels";

export const deliveryAttemptStatus = pgEnum("delivery_attempt_status", [
  "pending",
  "queued",
  "sent",
  "delivered",
  "bounced",
  "failed",
]);

export const notificationDeliveryAttempts = pgTable(
  "notification_delivery_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    notificationId: uuid("notification_id")
      .notNull()
      .references(() => notifications.id, { onDelete: "cascade" }),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => notificationChannels.id, { onDelete: "restrict" }), // Restrict: don't delete a channel that has delivery history.

    status: deliveryAttemptStatus("status").notNull().default("pending"),

    providerMessageId: text("provider_message_id"), // e.g., SendGrid's "X-Message-Id", Twilio's "SM..." SID.
    providerResponse: jsonb("provider_response"), // Raw provider response for debugging.

    errorCode: text("error_code"), // Provider-specific error code (e.g., "550", "InvalidRegistration").
    errorMessage: text("error_message"), // Human-readable error description.

    attemptNumber: integer("attempt_number").notNull().default(1), // 1 = first try, 2 = first retry, etc.
    nextRetryAt: timestamp("next_retry_at", { withTimezone: true }), // Null = no retry planned.

    sentAt: timestamp("sent_at", { withTimezone: true }), // When the provider accepted the request.
    deliveredAt: timestamp("delivered_at", { withTimezone: true }), // When delivery was confirmed (from provider webhook).
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_delivery_attempts_notification_id").on(
      table.notificationId
    ),
    index("idx_notification_delivery_attempts_channel_id_status").on(
      table.channelId,
      table.status
    ),
    index("idx_notification_delivery_attempts_provider_message_id").on(
      table.providerMessageId
    ),
    index("idx_notification_delivery_attempts_status_next_retry_at").on(
      table.status,
      table.nextRetryAt
    ),
    index("idx_notification_delivery_attempts_created_at").on(table.createdAt),
  ]
);

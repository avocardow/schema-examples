// email_suppression_list: Email addresses that should not be sent to. Prevents sending to bounced, complained, or unsubscribed addresses.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { notificationChannels } from "./notification_channels";

export const suppressionReason = pgEnum("suppression_reason", [
  "hard_bounce",
  "soft_bounce",
  "spam_complaint",
  "manual_unsubscribe",
  "invalid_address",
]);

export const suppressionSource = pgEnum("suppression_source", [
  "provider_webhook",
  "user_action",
  "admin",
  "system",
]);

export const emailSuppressionList = pgTable(
  "email_suppression_list",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    email: text("email").notNull(), // Lowercase, trimmed.

    reason: suppressionReason("reason").notNull(),
    source: suppressionSource("source").notNull(),

    channelId: uuid("channel_id").references(
      () => notificationChannels.id,
      { onDelete: "set null" }
    ),

    details: jsonb("details"), // Provider-specific details for debugging.

    suppressedAt: timestamp("suppressed_at", { withTimezone: true })
      .notNull()
      .defaultNow(), // May differ from created_at if back-dated from provider data.
    expiresAt: timestamp("expires_at", { withTimezone: true }), // Null = permanent suppression.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_email_suppression_list_email_reason").on(
      table.email,
      table.reason
    ),
    index("idx_email_suppression_list_email").on(table.email),
    index("idx_email_suppression_list_reason").on(table.reason),
    index("idx_email_suppression_list_expires_at").on(table.expiresAt),
  ]
);

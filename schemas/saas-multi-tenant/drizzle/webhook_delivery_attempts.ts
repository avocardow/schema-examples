// webhook_delivery_attempts: Tracks each delivery attempt for a webhook message to an endpoint.
// See README.md for full schema documentation.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { webhookMessages } from "./webhook_messages";
import { webhookEndpoints } from "./webhook_endpoints";

export const webhookDeliveryStatusEnum = pgEnum("webhook_delivery_status", [
  "pending",
  "success",
  "failed",
]);

export const webhookDeliveryAttempts = pgTable(
  "webhook_delivery_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => webhookMessages.id, { onDelete: "cascade" }),
    endpointId: uuid("endpoint_id")
      .notNull()
      .references(() => webhookEndpoints.id, { onDelete: "cascade" }),
    attemptNumber: integer("attempt_number").notNull().default(1),
    status: webhookDeliveryStatusEnum("status").notNull().default("pending"),
    httpStatus: integer("http_status"),
    responseBody: text("response_body"),
    errorMessage: text("error_message"),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }),
    durationMs: integer("duration_ms"),
    nextRetryAt: timestamp("next_retry_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_webhook_delivery_attempts_message_attempt").on(
      table.messageId,
      table.attemptNumber
    ),
    index("idx_webhook_delivery_attempts_endpoint_created").on(
      table.endpointId,
      table.createdAt
    ),
    index("idx_webhook_delivery_attempts_status_retry").on(
      table.status,
      table.nextRetryAt
    ),
  ]
);

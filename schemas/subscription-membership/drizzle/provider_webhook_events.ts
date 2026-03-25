// provider_webhook_events: Idempotent log of inbound webhook events from payment providers.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";

export const providerWebhookEvents = pgTable(
  "provider_webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerType: text("provider_type").notNull(),
    providerEventId: text("provider_event_id").notNull(),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    processingError: text("processing_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_provider_webhook_events_provider_event").on(table.providerType, table.providerEventId),
    index("idx_provider_webhook_events_event_type").on(table.eventType),
    index("idx_provider_webhook_events_processed_at").on(table.processedAt),
  ]
);

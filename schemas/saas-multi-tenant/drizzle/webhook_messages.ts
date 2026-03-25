// webhook_messages: Stores individual webhook event messages for delivery tracking.
// See README.md for full schema documentation.

import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { webhookEventTypes } from "./webhook_event_types";

export const webhookMessages = pgTable(
  "webhook_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    eventTypeId: uuid("event_type_id")
      .notNull()
      .references(() => webhookEventTypes.id, { onDelete: "restrict" }),
    eventId: varchar("event_id", { length: 255 }).notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_webhook_messages_org_created").on(
      table.organizationId,
      table.createdAt
    ),
    index("idx_webhook_messages_event_type").on(table.eventTypeId),
    index("idx_webhook_messages_event_id").on(table.eventId),
  ]
);

// webhook_event_types: Defines the types of events that can trigger webhooks.
// See README.md for full schema documentation.

import { pgTable, uuid, varchar, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const webhookEventTypes = pgTable(
  "webhook_event_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_webhook_event_types_is_enabled").on(table.isEnabled),
  ]
);

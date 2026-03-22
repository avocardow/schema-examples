// event_properties: Key-value property pairs attached to individual events.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const eventProperties = pgTable(
  "event_properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_event_properties_event_id_key").on(table.eventId, table.key),
    index("idx_event_properties_key_value").on(table.key, table.value),
  ]
);

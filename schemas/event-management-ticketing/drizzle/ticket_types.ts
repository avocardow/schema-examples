// ticket_types: Defines pricing tiers and availability for event tickets.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const ticketTypes = pgTable(
  "ticket_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull().default(0),
    currency: text("currency").notNull().default("USD"),
    quantityTotal: integer("quantity_total"),
    quantitySold: integer("quantity_sold").notNull().default(0),
    minPerOrder: integer("min_per_order").notNull().default(1),
    maxPerOrder: integer("max_per_order").notNull().default(10),
    saleStartAt: timestamp("sale_start_at", { withTimezone: true }),
    saleEndAt: timestamp("sale_end_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    isHidden: boolean("is_hidden").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_ticket_types_event_id_position").on(
      table.eventId,
      table.position,
    ),
    index("idx_ticket_types_event_id_is_active").on(
      table.eventId,
      table.isActive,
    ),
  ],
);

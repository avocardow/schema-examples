// order_items: Individual line items within an order, each tied to a ticket type.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { ticketTypes } from "./ticket_types";

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    ticketTypeId: uuid("ticket_type_id").references(() => ticketTypes.id, {
      onDelete: "set null",
    }),
    ticketTypeName: text("ticket_type_name").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    subtotal: integer("subtotal").notNull(),
    currency: text("currency").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_order_items_order_id").on(table.orderId),
    index("idx_order_items_ticket_type_id").on(table.ticketTypeId),
  ],
);

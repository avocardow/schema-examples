// tickets: Individual admission tickets issued to holders for event entry.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { orderItems } from "./order_items";
import { events } from "./events";
import { ticketTypes } from "./ticket_types";
import { users } from "../../auth-rbac/drizzle/users";

export const ticketStatusEnum = pgEnum("ticket_status", [
  "valid",
  "used",
  "cancelled",
  "transferred",
  "expired",
]);

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "restrict" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),
    ticketTypeId: uuid("ticket_type_id").references(() => ticketTypes.id, {
      onDelete: "set null",
    }),
    holderUserId: uuid("holder_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    holderName: text("holder_name").notNull(),
    holderEmail: text("holder_email").notNull(),
    ticketCode: text("ticket_code").notNull().unique(),
    status: ticketStatusEnum("status").notNull().default("valid"),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_tickets_event_id_status").on(table.eventId, table.status),
    index("idx_tickets_holder_user_id").on(table.holderUserId),
    index("idx_tickets_holder_email").on(table.holderEmail),
    index("idx_tickets_order_item_id").on(table.orderItemId),
  ],
);

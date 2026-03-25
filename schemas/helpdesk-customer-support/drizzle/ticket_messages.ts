// ticket_messages: conversation thread entries including replies, internal notes, customer messages, and system events.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";

export const ticketMessageTypeEnum = pgEnum("ticket_message_type", [
  "reply",
  "note",
  "customer_message",
  "system",
]);

export const ticketMessageChannelEnum = pgEnum("ticket_message_channel", [
  "email",
  "web",
  "api",
  "system",
]);

export const ticketMessages = pgTable(
  "ticket_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").references(() => users.id, { onDelete: "set null" }),
    type: ticketMessageTypeEnum("type").notNull(),
    body: text("body").notNull(),
    isPrivate: boolean("is_private").notNull().default(false),
    channel: ticketMessageChannelEnum("channel").notNull().default("web"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ticket_messages_ticket_id_created_at").on(table.ticketId, table.createdAt),
    index("idx_ticket_messages_sender_id").on(table.senderId),
  ]
);

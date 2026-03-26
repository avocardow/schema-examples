// ticket_transfers: Audit trail of ticket ownership transfers between holders.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "../../auth-rbac/drizzle/users";

export const ticketTransfers = pgTable(
  "ticket_transfers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    fromUserId: uuid("from_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    fromName: text("from_name").notNull(),
    fromEmail: text("from_email").notNull(),
    toUserId: uuid("to_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    toName: text("to_name").notNull(),
    toEmail: text("to_email").notNull(),
    transferredAt: timestamp("transferred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_ticket_transfers_ticket_id").on(table.ticketId),
    index("idx_ticket_transfers_from_user_id").on(table.fromUserId),
    index("idx_ticket_transfers_to_user_id").on(table.toUserId),
  ],
);

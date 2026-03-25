// ticket_followers: users subscribed to ticket updates as watchers or CCs.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";

export const ticketFollowers = pgTable(
  "ticket_followers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_ticket_followers_ticket_id_user_id").on(table.ticketId, table.userId),
    index("idx_ticket_followers_user_id").on(table.userId),
  ]
);

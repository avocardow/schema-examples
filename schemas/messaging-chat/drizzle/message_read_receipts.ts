// message_read_receipts: Per-message delivery and read tracking.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { users } from "./users";

export const messageReadReceipts = pgTable(
  "message_read_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.messageId, t.userId),
    index().on(t.userId, t.readAt),
  ]
);

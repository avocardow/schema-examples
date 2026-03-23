// bookmarked_messages: Per-user saved messages for quick reference.
// See README.md for full design rationale.
import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { messages } from "./messages";

export const bookmarkedMessages = pgTable(
  "bookmarked_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.userId, t.messageId),
    index().on(t.userId, t.createdAt),
  ]
);

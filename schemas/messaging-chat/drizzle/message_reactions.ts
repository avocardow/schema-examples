// message_reactions: Emoji reactions on messages.
// See README.md for full design rationale.
import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { users } from "./users";

export const messageReactions = pgTable(
  "message_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_message_reactions_user_id").on(table.userId),
    unique("uq_message_reactions_message_user_emoji").on(table.messageId, table.userId, table.emoji),
  ]
);

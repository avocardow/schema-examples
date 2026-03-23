// pinned_messages: Messages pinned to conversations for quick reference.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { conversations } from "./conversations";
import { messages } from "./messages";
import { users } from "./users";

export const pinnedMessages = pgTable(
  "pinned_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    pinnedBy: uuid("pinned_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pinnedAt: timestamp("pinned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.conversationId, table.messageId),
    index().on(table.conversationId, table.pinnedAt),
  ]
);

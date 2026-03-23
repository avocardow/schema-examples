// messages: Individual messages within conversations with threading support.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum, index, AnyPgColumn } from "drizzle-orm/pg-core";

import { conversations } from "./conversations";
import { users } from "./users";

export const messageContentTypeEnum = pgEnum("message_content_type", [
  "text",
  "system",
  "deleted",
]);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").references(() => users.id, {
      onDelete: "set null",
    }),
    content: text("content"),
    contentType: messageContentTypeEnum("content_type").notNull().default("text"),
    parentMessageId: uuid("parent_message_id").references(
      (): AnyPgColumn => messages.id,
      { onDelete: "set null" }
    ),
    replyCount: integer("reply_count").notNull().default(0),
    lastReplyAt: timestamp("last_reply_at", { withTimezone: true }),
    isEdited: boolean("is_edited").notNull().default(false),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("messages_conversation_id_created_at_idx").on(
      table.conversationId,
      table.createdAt
    ),
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_parent_message_id_idx").on(table.parentMessageId),
    index("messages_conversation_id_parent_message_id_idx").on(
      table.conversationId,
      table.parentMessageId
    ),
    index("messages_expires_at_idx").on(table.expiresAt),
  ]
);

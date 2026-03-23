// conversations: core conversation container for direct messages, group chats, and channels.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const conversationTypeEnum = pgEnum("conversation_type", ["direct", "group", "channel"]);

export const conversations = pgTable("conversations", {
    id: uuid("id").primaryKey().defaultRandom(),
    type: conversationTypeEnum("type").notNull(),
    name: text("name"),
    description: text("description"),
    slug: text("slug").unique(),
    isPrivate: boolean("is_private").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    messageCount: integer("message_count").notNull().default(0),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_conversations_type").on(table.type),
    index("idx_conversations_is_private_type").on(table.isPrivate, table.type),
    index("idx_conversations_created_by").on(table.createdBy),
    index("idx_conversations_last_message_at").on(table.lastMessageAt),
  ]
);

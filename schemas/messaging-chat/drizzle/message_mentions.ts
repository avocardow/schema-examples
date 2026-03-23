// message_mentions: @mentions within messages targeting users or channels.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { users } from "./users";

export const mentionTypeEnum = pgEnum("mention_type", ["user", "channel", "all"]);

export const messageMentions = pgTable(
  "message_mentions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
    mentionedUserId: uuid("mentioned_user_id").references(() => users.id, { onDelete: "cascade" }),
    mentionType: mentionTypeEnum("mention_type").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.messageId, table.mentionedUserId, table.mentionType),
    index().on(table.mentionedUserId),
  ]
);

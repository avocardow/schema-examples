// meeting_chat_messages: In-meeting chat messages, optionally directed to a specific user.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const meetingChatMessages = pgTable(
  "meeting_chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").references(() => users.id, { onDelete: "set null" }),
    recipientId: uuid("recipient_id").references(() => users.id, { onDelete: "set null" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_meeting_chat_messages_meeting_id_created_at").on(table.meetingId, table.createdAt),
    index("idx_meeting_chat_messages_sender_id").on(table.senderId),
  ]
);

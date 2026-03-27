// meeting_reactions: Ephemeral emoji reactions sent during a meeting.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const meetingReactions = pgTable(
  "meeting_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_meeting_reactions_meeting_id_created_at").on(table.meetingId, table.createdAt),
    index("idx_meeting_reactions_meeting_id_emoji").on(table.meetingId, table.emoji),
  ]
);

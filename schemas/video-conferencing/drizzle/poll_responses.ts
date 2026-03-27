// poll_responses: Individual user responses to meeting polls.
// See README.md for full design rationale.

import { pgTable, uuid, jsonb, timestamp, index, unique } from "drizzle-orm/pg-core";
import { meetingPolls } from "./meeting_polls";
import { users } from "./users";

export const pollResponses = pgTable(
  "poll_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id").notNull().references(() => meetingPolls.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    selectedOptions: jsonb("selected_options").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_poll_responses_poll_id_user_id").on(table.pollId, table.userId),
    index("idx_poll_responses_user_id").on(table.userId),
  ]
);

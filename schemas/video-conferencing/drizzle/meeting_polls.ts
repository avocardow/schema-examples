// meeting_polls: Polls launched during meetings for real-time audience feedback.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const pollTypeEnum = pgEnum("poll_type", ["single_choice", "multiple_choice"]);
export const pollStatusEnum = pgEnum("poll_status", ["draft", "active", "closed"]);

export const meetingPolls = pgTable(
  "meeting_polls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    options: jsonb("options").notNull(),
    pollType: pollTypeEnum("poll_type").notNull().default("single_choice"),
    status: pollStatusEnum("status").notNull().default("draft"),
    launchedAt: timestamp("launched_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_meeting_polls_meeting_id_status").on(table.meetingId, table.status),
    index("idx_meeting_polls_meeting_id_created_at").on(table.meetingId, table.createdAt),
  ]
);

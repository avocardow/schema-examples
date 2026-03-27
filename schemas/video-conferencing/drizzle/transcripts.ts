// transcripts: Meeting transcription jobs with processing status.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const transcriptStatusEnum = pgEnum("transcript_status", ["processing", "ready", "failed"]);

export const transcripts = pgTable(
  "transcripts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    language: text("language").notNull().default("en"),
    status: transcriptStatusEnum("status").notNull().default("processing"),
    startedBy: uuid("started_by").references(() => users.id, { onDelete: "set null" }),
    segmentCount: integer("segment_count").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_transcripts_meeting_id").on(table.meetingId),
    index("idx_transcripts_status").on(table.status),
  ]
);

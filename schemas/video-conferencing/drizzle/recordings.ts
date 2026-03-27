// recordings: Captured audio/video recordings of meetings.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, integer, bigint, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";
import { files } from "./files";

export const recordingTypeEnum = pgEnum("recording_type", ["composite", "audio_only", "video_only", "screen_share"]);
export const recordingStatusEnum = pgEnum("recording_status", ["recording", "processing", "ready", "failed", "deleted"]);

export const recordings = pgTable(
  "recordings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    fileId: uuid("file_id").references(() => files.id, { onDelete: "set null" }),
    type: recordingTypeEnum("type").notNull().default("composite"),
    status: recordingStatusEnum("status").notNull().default("recording"),
    durationSeconds: integer("duration_seconds"),
    fileSize: bigint("file_size", { mode: "number" }),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    startedBy: uuid("started_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_recordings_meeting_id").on(table.meetingId),
    index("idx_recordings_status").on(table.status),
    index("idx_recordings_started_by").on(table.startedBy),
  ]
);

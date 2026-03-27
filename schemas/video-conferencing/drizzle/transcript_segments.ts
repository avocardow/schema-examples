// transcript_segments: Individual spoken segments within a transcript with timing data.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { transcripts } from "./transcripts";
import { users } from "./users";

export const transcriptSegments = pgTable(
  "transcript_segments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    transcriptId: uuid("transcript_id").notNull().references(() => transcripts.id, { onDelete: "cascade" }),
    speakerId: uuid("speaker_id").references(() => users.id, { onDelete: "set null" }),
    content: text("content").notNull(),
    speakerName: text("speaker_name"),
    startMs: integer("start_ms").notNull(),
    endMs: integer("end_ms").notNull(),
    position: integer("position").notNull(),
    confidence: numeric("confidence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_transcript_segments_transcript_id_position").on(table.transcriptId, table.position),
    index("idx_transcript_segments_transcript_id_start_ms").on(table.transcriptId, table.startMs),
    index("idx_transcript_segments_speaker_id").on(table.speakerId),
  ]
);

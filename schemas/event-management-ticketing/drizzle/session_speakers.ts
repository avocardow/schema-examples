// session_speakers: Links speakers to event sessions with role and display order.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { eventSessions } from "./event_sessions";
import { speakers } from "./speakers";

export const speakerRoleEnum = pgEnum("speaker_role", [
  "speaker",
  "moderator",
  "panelist",
  "host",
  "keynote",
]);

export const sessionSpeakers = pgTable(
  "session_speakers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => eventSessions.id, { onDelete: "cascade" }),
    speakerId: uuid("speaker_id")
      .notNull()
      .references(() => speakers.id, { onDelete: "cascade" }),
    role: speakerRoleEnum("role").notNull().default("speaker"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_session_speakers_session_id_speaker_id").on(
      table.sessionId,
      table.speakerId,
    ),
    index("idx_session_speakers_speaker_id").on(table.speakerId),
  ],
);

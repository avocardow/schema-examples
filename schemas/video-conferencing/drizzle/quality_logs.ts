// quality_logs: Periodic network and media quality samples per participant.
// See README.md for full design rationale.

import { pgTable, uuid, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { meetingParticipants } from "./meeting_participants";

export const qualityLogs = pgTable(
  "quality_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    participantId: uuid("participant_id").notNull().references(() => meetingParticipants.id, { onDelete: "cascade" }),
    bitrateKbps: integer("bitrate_kbps"),
    packetLossPct: numeric("packet_loss_pct"),
    jitterMs: integer("jitter_ms"),
    roundTripMs: integer("round_trip_ms"),
    videoWidth: integer("video_width"),
    videoHeight: integer("video_height"),
    framerate: integer("framerate"),
    qualityScore: numeric("quality_score"),
    loggedAt: timestamp("logged_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_quality_logs_meeting_id_logged_at").on(table.meetingId, table.loggedAt),
    index("idx_quality_logs_participant_id_logged_at").on(table.participantId, table.loggedAt),
  ]
);

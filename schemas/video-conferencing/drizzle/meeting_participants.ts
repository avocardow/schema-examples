// meeting_participants: Tracks each user's participation in a meeting with media state.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const participantRoleEnum = pgEnum("participant_role", ["host", "co_host", "moderator", "attendee", "viewer"]);

export const meetingParticipants = pgTable(
  "meeting_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    displayName: text("display_name").notNull(),
    role: participantRoleEnum("role").notNull().default("attendee"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    leftAt: timestamp("left_at", { withTimezone: true }),
    durationSeconds: integer("duration_seconds"),
    isCameraOn: boolean("is_camera_on").notNull().default(false),
    isMicOn: boolean("is_mic_on").notNull().default(false),
    isScreenSharing: boolean("is_screen_sharing").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_meeting_participants_meeting_id_user_id").on(table.meetingId, table.userId),
    index("idx_meeting_participants_user_id").on(table.userId),
    index("idx_meeting_participants_meeting_id_joined_at").on(table.meetingId, table.joinedAt),
  ]
);

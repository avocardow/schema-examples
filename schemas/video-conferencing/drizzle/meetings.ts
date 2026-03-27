// meetings: Individual meeting sessions held within a room, tracking lifecycle and scheduling.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { rooms } from "./rooms";
import { users } from "./users";

export const meetingStatusEnum = pgEnum("meeting_status", ["scheduled", "live", "ended", "cancelled"]);

export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    title: text("title"),
    status: meetingStatusEnum("status").notNull().default("scheduled"),
    scheduledStart: timestamp("scheduled_start", { withTimezone: true }),
    scheduledEnd: timestamp("scheduled_end", { withTimezone: true }),
    actualStart: timestamp("actual_start", { withTimezone: true }),
    actualEnd: timestamp("actual_end", { withTimezone: true }),
    maxParticipants: integer("max_participants"),
    enableWaitingRoom: boolean("enable_waiting_room"),
    hostId: uuid("host_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    participantCount: integer("participant_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_meetings_room_id_scheduled_start").on(table.roomId, table.scheduledStart),
    index("idx_meetings_host_id").on(table.hostId),
    index("idx_meetings_status").on(table.status),
    index("idx_meetings_scheduled_start").on(table.scheduledStart),
    index("idx_meetings_actual_start").on(table.actualStart),
  ]
);

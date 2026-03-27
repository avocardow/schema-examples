// breakout_rooms: Smaller sub-rooms within a meeting for group activities.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";

export const breakoutRoomStatusEnum = pgEnum("breakout_room_status", ["pending", "open", "closed"]);

export const breakoutRooms = pgTable(
  "breakout_rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: integer("position").notNull().default(0),
    status: breakoutRoomStatusEnum("status").notNull().default("pending"),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_breakout_rooms_meeting_id_position").on(table.meetingId, table.position),
    index("idx_breakout_rooms_meeting_id_status").on(table.meetingId, table.status),
  ]
);

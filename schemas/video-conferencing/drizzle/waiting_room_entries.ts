// waiting_room_entries: Users waiting to be admitted into a meeting.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const waitingRoomStatusEnum = pgEnum("waiting_room_status", ["waiting", "admitted", "rejected"]);

export const waitingRoomEntries = pgTable(
  "waiting_room_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    status: waitingRoomStatusEnum("status").notNull().default("waiting"),
    admittedBy: uuid("admitted_by").references(() => users.id, { onDelete: "set null" }),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_waiting_room_entries_meeting_id_status").on(table.meetingId, table.status),
    index("idx_waiting_room_entries_meeting_id_created_at").on(table.meetingId, table.createdAt),
  ]
);

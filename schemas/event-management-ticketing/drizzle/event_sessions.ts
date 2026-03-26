// event_sessions: Individual sessions or tracks within a larger event.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { venues } from "./venues";

export const sessionStatusEnum = pgEnum("session_status", [
  "scheduled",
  "cancelled",
  "rescheduled",
]);

export const eventSessions = pgTable(
  "event_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    venueId: uuid("venue_id").references(() => venues.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    track: text("track"),
    maxAttendees: integer("max_attendees"),
    position: integer("position").notNull().default(0),
    status: sessionStatusEnum("status").notNull().default("scheduled"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_event_sessions_event_id_start_time").on(
      table.eventId,
      table.startTime,
    ),
    index("idx_event_sessions_event_id_track").on(
      table.eventId,
      table.track,
    ),
    index("idx_event_sessions_status").on(table.status),
  ],
);

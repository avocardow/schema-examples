// quiet_hours: Per-user Do Not Disturb schedules with timezone support.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";

export const quietHours = pgTable(
  "quiet_hours",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    timezone: text("timezone").notNull(), // IANA timezone (e.g., "America/New_York", "Europe/London", "Asia/Tokyo").

    // The quiet window. Cross-midnight works naturally: start=22:00, end=08:00 means 10pm to 8am.
    startTime: text("start_time").notNull(), // Local time in HH:MM format (e.g., "22:00").
    endTime: text("end_time").notNull(), // Local time in HH:MM format (e.g., "08:00").

    // Array of ISO day numbers: 1=Monday, 2=Tuesday, ..., 7=Sunday.
    daysOfWeek: integer("days_of_week").array().notNull(), // Array of ISO day numbers (1-7).

    isActive: boolean("is_active").notNull().default(true), // Toggle the schedule without deleting it.

    // Ad-hoc snooze: temporary DND override. Null = no active snooze.
    snoozeUntil: timestamp("snooze_until", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_quiet_hours_user_id").on(table.userId),
    index("idx_quiet_hours_user_id_is_active").on(table.userId, table.isActive),
  ]
);

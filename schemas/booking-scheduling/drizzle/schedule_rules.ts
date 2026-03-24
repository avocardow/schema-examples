// schedule_rules: recurring weekly availability windows within a schedule.
// See README.md for full design rationale.

import { pgTable, uuid, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { schedules } from "./schedules";

export const scheduleRules = pgTable(
  "schedule_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("schedule_id").notNull().references(() => schedules.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_schedule_rules_schedule_id_day_of_week").on(table.scheduleId, table.dayOfWeek),
  ]
);

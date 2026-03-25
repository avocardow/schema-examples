// business_schedule_entries: daily time windows defining working hours for a business schedule.
// See README.md for full design rationale.

import { pgTable, uuid, integer, text, index } from "drizzle-orm/pg-core";
import { businessSchedules } from "./business_schedules";

export const businessScheduleEntries = pgTable(
  "business_schedule_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("schedule_id").notNull().references(() => businessSchedules.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
  },
  (table) => [
    index("idx_business_schedule_entries_schedule_id_day_of_week").on(table.scheduleId, table.dayOfWeek),
  ]
);

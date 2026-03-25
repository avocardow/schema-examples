// business_schedule_holidays: named holiday exceptions that pause the SLA clock.
// See README.md for full design rationale.

import { pgTable, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";
import { businessSchedules } from "./business_schedules";

export const businessScheduleHolidays = pgTable(
  "business_schedule_holidays",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("schedule_id").notNull().references(() => businessSchedules.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    date: text("date").notNull(),
  },
  (table) => [
    uniqueIndex("uq_business_schedule_holidays_schedule_id_date").on(table.scheduleId, table.date),
  ]
);

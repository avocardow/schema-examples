// schedule_overrides: single-date exceptions to recurring schedule rules.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { schedules } from "./schedules";

export const scheduleOverrides = pgTable(
  "schedule_overrides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("schedule_id").notNull().references(() => schedules.id, { onDelete: "cascade" }),
    overrideDate: text("override_date").notNull(),
    startTime: text("start_time"),
    endTime: text("end_time"),
    isAvailable: boolean("is_available").notNull().default(true),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_schedule_overrides_schedule_id_override_date").on(table.scheduleId, table.overrideDate),
  ]
);

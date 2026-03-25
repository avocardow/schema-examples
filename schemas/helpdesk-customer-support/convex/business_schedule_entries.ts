// business_schedule_entries: individual working-hour windows per day of week for a schedule.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const business_schedule_entries = defineTable({
  scheduleId: v.id("business_schedules"),
  dayOfWeek: v.number(),
  startTime: v.string(),
  endTime: v.string(),
})
  .index("by_schedule_id_and_day_of_week", ["scheduleId", "dayOfWeek"]);

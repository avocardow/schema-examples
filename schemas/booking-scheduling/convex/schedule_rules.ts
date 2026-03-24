// schedule_rules: recurring weekly time blocks defining provider availability.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const scheduleRules = defineTable({
  scheduleId: v.id("schedules"),
  dayOfWeek: v.number(),
  startTime: v.string(),
  endTime: v.string(),
})
  .index("by_schedule_id_day_of_week", ["scheduleId", "dayOfWeek"]);

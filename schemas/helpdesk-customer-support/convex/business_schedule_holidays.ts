// business_schedule_holidays: named holiday dates that override normal working hours.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const business_schedule_holidays = defineTable({
  scheduleId: v.id("business_schedules"),
  name: v.string(),
  date: v.string(),
})
  .index("by_schedule_id_and_date", ["scheduleId", "date"]);

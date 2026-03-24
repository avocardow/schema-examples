// schedule_overrides: date-specific availability exceptions that override regular schedule rules.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const scheduleOverrides = defineTable({
  scheduleId: v.id("schedules"),
  overrideDate: v.string(),
  startTime: v.optional(v.string()),
  endTime: v.optional(v.string()),
  isAvailable: v.boolean(),
  reason: v.optional(v.string()),
})
  .index("by_schedule_id_override_date", ["scheduleId", "overrideDate"]);

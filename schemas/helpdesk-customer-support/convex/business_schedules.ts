// business_schedules: named working-hour schedules used by SLA policies for time calculations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const business_schedules = defineTable({
  name: v.string(),
  timezone: v.string(),
  isDefault: v.boolean(),
  updatedAt: v.number(),
});

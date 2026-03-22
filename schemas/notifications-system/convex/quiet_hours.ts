// quiet_hours: Per-user Do Not Disturb schedules with timezone support.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const quiet_hours = defineTable({
  userId: v.id("users"),

  // IANA timezone (e.g., "America/New_York"). Quiet hours are evaluated in the user's local time.
  timezone: v.string(),

  // Local times in HH:MM format. Cross-midnight works naturally: start=22:00, end=08:00.
  startTime: v.string(),
  endTime: v.string(),

  // ISO day numbers (1=Monday … 7=Sunday). E.g., [1,2,3,4,5] = weekdays only.
  daysOfWeek: v.array(v.number()),

  isActive: v.boolean(), // Toggle the schedule without deleting it.

  // Temporary DND override. Null = no active snooze.
  snoozeUntil: v.optional(v.number()),

  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_user_id_is_active", ["userId", "isActive"]);

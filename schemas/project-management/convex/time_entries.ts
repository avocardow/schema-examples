// timeEntries: logged time spent on tasks by users.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const timeEntries = defineTable({
  taskId: v.id("tasks"),
  userId: v.id("users"),
  description: v.optional(v.string()),
  startTime: v.optional(v.number()),
  endTime: v.optional(v.number()),
  duration: v.number(),
  updatedAt: v.number(),
})
  .index("by_task_id", ["taskId"])
  .index("by_user_id_start_time", ["userId", "startTime"]);

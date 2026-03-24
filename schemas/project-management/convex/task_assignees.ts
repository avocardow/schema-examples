// taskAssignees: maps users to tasks with assignee or reviewer roles.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskAssignees = defineTable({
  taskId: v.id("tasks"),
  userId: v.id("users"),
  role: v.union(v.literal("assignee"), v.literal("reviewer")),
})
  .index("by_task_id_user_id", ["taskId", "userId"])
  .index("by_user_id", ["userId"]);

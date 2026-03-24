// taskComments: threaded discussion comments on tasks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskComments = defineTable({
  taskId: v.id("tasks"),
  userId: v.optional(v.id("users")),
  parentId: v.optional(v.id("taskComments")),
  content: v.string(),
  updatedAt: v.number(),
})
  .index("by_task_id", ["taskId"])
  .index("by_parent_id", ["parentId"])
  .index("by_user_id", ["userId"]);

// taskActivities: audit log of actions performed on tasks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskActivities = defineTable({
  taskId: v.id("tasks"),
  userId: v.optional(v.id("users")),
  action: v.union(
    v.literal("created"),
    v.literal("updated"),
    v.literal("commented"),
    v.literal("assigned"),
    v.literal("unassigned"),
    v.literal("labeled"),
    v.literal("unlabeled"),
    v.literal("moved"),
    v.literal("archived"),
    v.literal("restored")
  ),
  field: v.optional(v.string()),
  oldValue: v.optional(v.string()),
  newValue: v.optional(v.string()),
})
  .index("by_task_id_creation_time", ["taskId", "_creationTime"])
  .index("by_user_id", ["userId"]);

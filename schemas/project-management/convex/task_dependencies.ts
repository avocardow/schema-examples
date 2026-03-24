// taskDependencies: directed relationships between tasks such as blocking or duplication.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskDependencies = defineTable({
  taskId: v.id("tasks"),
  dependsOnId: v.id("tasks"),
  type: v.union(
    v.literal("blocks"),
    v.literal("is_blocked_by"),
    v.literal("relates_to"),
    v.literal("duplicates")
  ),
})
  .index("by_task_id_depends_on_id_type", ["taskId", "dependsOnId", "type"])
  .index("by_depends_on_id", ["dependsOnId"]);

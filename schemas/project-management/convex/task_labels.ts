// taskLabels: join table linking tasks to their assigned labels.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskLabels = defineTable({
  taskId: v.id("tasks"),
  labelId: v.id("labels"),
})
  .index("by_task_id_label_id", ["taskId", "labelId"])
  .index("by_label_id", ["labelId"]);

// customFieldValues: stores the value of a custom field for a specific task.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customFieldValues = defineTable({
  taskId: v.id("tasks"),
  customFieldId: v.id("customFields"),
  value: v.string(),
  updatedAt: v.number(),
})
  .index("by_task_id_custom_field_id", ["taskId", "customFieldId"])
  .index("by_custom_field_id", ["customFieldId"]);

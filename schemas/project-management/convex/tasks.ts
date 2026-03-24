// tasks: individual work items with status, priority, and hierarchical structure.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tasks = defineTable({
  projectId: v.id("projects"),
  taskListId: v.optional(v.id("taskLists")),
  parentId: v.optional(v.id("tasks")),
  statusId: v.optional(v.id("projectStatuses")),
  milestoneId: v.optional(v.id("milestones")),
  number: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  type: v.union(
    v.literal("task"),
    v.literal("bug"),
    v.literal("story"),
    v.literal("epic")
  ),
  priority: v.union(
    v.literal("none"),
    v.literal("urgent"),
    v.literal("high"),
    v.literal("medium"),
    v.literal("low")
  ),
  dueDate: v.optional(v.string()),
  startDate: v.optional(v.string()),
  estimatePoints: v.optional(v.number()),
  position: v.number(),
  completedAt: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_project_id_number", ["projectId", "number"])
  .index("by_project_id_status_id", ["projectId", "statusId"])
  .index("by_task_list_id_position", ["taskListId", "position"])
  .index("by_parent_id", ["parentId"])
  .index("by_milestone_id", ["milestoneId"])
  .index("by_type", ["type"])
  .index("by_due_date", ["dueDate"])
  .index("by_created_by", ["createdBy"]);

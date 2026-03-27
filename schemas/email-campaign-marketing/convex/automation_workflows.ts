// automation_workflows: Configurable triggered workflows for automated email sequences.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const automationWorkflows = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  triggerType: v.union(
    v.literal("list_join"),
    v.literal("tag_added"),
    v.literal("manual"),
    v.literal("event")
  ),
  triggerConfig: v.optional(v.any()),
  isActive: v.boolean(),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_is_active", ["isActive"])
  .index("by_trigger_type", ["triggerType"]);

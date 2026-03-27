// automation_enrollments: Tracks contacts enrolled in automation workflows and their progress.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const automationEnrollments = defineTable({
  workflowId: v.id("automationWorkflows"),
  contactId: v.id("contacts"),
  currentStepId: v.optional(v.id("automationSteps")),
  status: v.union(
    v.literal("active"),
    v.literal("completed"),
    v.literal("paused"),
    v.literal("exited")
  ),
  enrolledAt: v.number(),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_workflow_id_contact_id", ["workflowId", "contactId"])
  .index("by_contact_id", ["contactId"])
  .index("by_status", ["status"]);

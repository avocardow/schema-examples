// notification_workflow_runs: Execution instances of a workflow, tracking state from trigger to completion.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_workflow_runs = defineTable({
  workflowId: v.id("notification_workflows"),
  eventId: v.id("notification_events"),

  // Execution lifecycle.
  status: v.union(
    v.literal("pending"),
    v.literal("running"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("canceled")
  ),

  // Which step the workflow is currently on (or last completed).
  currentStepOrder: v.optional(v.number()),

  // Error details if the run failed.
  errorMessage: v.optional(v.string()),
  errorStepId: v.optional(v.id("notification_workflow_steps")),

  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_workflow_id_status", ["workflowId", "status"])
  .index("by_event_id", ["eventId"])
  .index("by_status_creation_time", ["status", "_creationTime"])
  .index("by_creation_time", ["_creationTime"]);

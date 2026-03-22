// notification_workflow_steps: Individual steps within a workflow, executing in ascending step_order.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_workflow_steps = defineTable({
  workflowId: v.id("notification_workflows"),

  stepOrder: v.number(), // Execution order within the workflow. Steps run in ascending order.

  stepType: v.union(
    v.literal("channel"),   // Deliver to a specific channel.
    v.literal("delay"),     // Wait for a duration before proceeding.
    v.literal("digest"),    // Batch/accumulate events within a time window.
    v.literal("condition"), // Evaluate a rule; skip remaining steps if false.
    v.literal("throttle")   // Limit delivery frequency (e.g., max 1 per hour).
  ),

  // For channel steps: which channel type to deliver to. Null for non-channel step types.
  channelType: v.optional(
    v.union(
      v.literal("email"),
      v.literal("sms"),
      v.literal("push"),
      v.literal("in_app"),
      v.literal("chat"),
      v.literal("webhook")
    )
  ),

  // Step configuration as JSON. Schema depends on stepType.
  config: v.optional(v.any()),

  // true = abort remaining steps on failure (fail-fast). false = continue (best-effort).
  shouldStopOnFail: v.boolean(),

  updatedAt: v.number(),
})
  .index("by_workflow_id", ["workflowId"])
  .index("by_workflow_id_step_order", ["workflowId", "stepOrder"]);

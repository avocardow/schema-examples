// automation_steps: Ordered steps within an automation workflow (send, delay, condition).
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const automationSteps = defineTable({
  workflowId: v.id("automationWorkflows"),
  stepOrder: v.number(),
  stepType: v.union(
    v.literal("send_email"),
    v.literal("delay"),
    v.literal("condition")
  ),
  templateId: v.optional(v.id("templates")),
  config: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_workflow_id_step_order", ["workflowId", "stepOrder"])
  .index("by_template_id", ["templateId"]);

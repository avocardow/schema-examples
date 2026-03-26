// finding_remediations: Remediation actions assigned to resolve audit findings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const findingRemediations = defineTable({
  findingId: v.id("audit_findings"),
  assignedTo: v.optional(v.id("users")),
  title: v.string(),
  description: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  priority: v.union(
    v.literal("critical"),
    v.literal("high"),
    v.literal("medium"),
    v.literal("low")
  ),
  dueDate: v.optional(v.string()),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_finding_id", ["findingId"])
  .index("by_assigned_to", ["assignedTo"])
  .index("by_status", ["status"])
  .index("by_priority", ["priority"])
  .index("by_due_date", ["dueDate"]);

// tickets: core support requests with status, priority, assignment, and SLA tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tickets = defineTable({
  subject: v.string(),
  description: v.optional(v.string()),
  statusId: v.id("ticket_statuses"),
  priorityId: v.id("ticket_priorities"),
  type: v.union(
    v.literal("question"),
    v.literal("incident"),
    v.literal("problem"),
    v.literal("feature_request")
  ),
  source: v.union(
    v.literal("email"),
    v.literal("web"),
    v.literal("phone"),
    v.literal("api"),
    v.literal("social")
  ),
  categoryId: v.optional(v.id("ticket_categories")),
  requesterId: v.id("users"),
  assignedAgentId: v.optional(v.id("users")),
  assignedTeamId: v.optional(v.string()),
  slaPolicyId: v.optional(v.id("sla_policies")),
  dueAt: v.optional(v.number()),
  firstResponseAt: v.optional(v.number()),
  resolvedAt: v.optional(v.number()),
  closedAt: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_status_id", ["statusId"])
  .index("by_priority_id", ["priorityId"])
  .index("by_requester_id", ["requesterId"])
  .index("by_assigned_agent_id", ["assignedAgentId"])
  .index("by_assigned_team_id", ["assignedTeamId"])
  .index("by_category_id", ["categoryId"])
  .index("by_sla_policy_id", ["slaPolicyId"])
  .index("by_creation_time", ["_creationTime"])
  .index("by_due_at", ["dueAt"]);

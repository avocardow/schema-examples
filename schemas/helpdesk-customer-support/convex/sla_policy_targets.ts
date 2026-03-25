// sla_policy_targets: response and resolution time targets per priority within an SLA policy.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const sla_policy_targets = defineTable({
  slaPolicyId: v.id("sla_policies"),
  priorityId: v.id("ticket_priorities"),
  firstResponseMinutes: v.optional(v.number()),
  nextResponseMinutes: v.optional(v.number()),
  resolutionMinutes: v.optional(v.number()),
})
  .index("by_sla_policy_id_and_priority_id", ["slaPolicyId", "priorityId"]);

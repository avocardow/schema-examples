// audits: Internal and external audit engagements.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const audits = defineTable({
  orgId: v.optional(v.id("organizations")),
  leadAuditorId: v.optional(v.id("users")),
  title: v.string(),
  auditType: v.union(
    v.literal("internal"),
    v.literal("external"),
    v.literal("self_assessment"),
    v.literal("certification")
  ),
  status: v.union(
    v.literal("planned"),
    v.literal("in_progress"),
    v.literal("review"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  scope: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  conclusion: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_organization_id", ["orgId"])
  .index("by_lead_auditor_id", ["leadAuditorId"])
  .index("by_audit_type", ["auditType"])
  .index("by_status", ["status"]);

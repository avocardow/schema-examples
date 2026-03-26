// audit_findings: Issues discovered during audits, linked to controls and risks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auditFindings = defineTable({
  auditId: v.id("audits"),
  controlId: v.optional(v.id("controls")),
  riskId: v.optional(v.id("risks")),
  title: v.string(),
  description: v.optional(v.string()),
  severity: v.union(
    v.literal("critical"),
    v.literal("high"),
    v.literal("medium"),
    v.literal("low"),
    v.literal("informational")
  ),
  status: v.union(
    v.literal("open"),
    v.literal("in_progress"),
    v.literal("remediated"),
    v.literal("accepted"),
    v.literal("closed")
  ),
  dueDate: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_audit_id", ["auditId"])
  .index("by_control_id", ["controlId"])
  .index("by_risk_id", ["riskId"])
  .index("by_severity", ["severity"])
  .index("by_status", ["status"]);

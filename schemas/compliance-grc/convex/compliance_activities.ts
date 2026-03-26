// compliance_activities: Audit trail of all compliance-related actions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const complianceActivities = defineTable({
  orgId: v.optional(v.id("organizations")),
  actorId: v.optional(v.id("users")),
  activityType: v.union(
    v.literal("control_created"),
    v.literal("control_updated"),
    v.literal("control_tested"),
    v.literal("risk_created"),
    v.literal("risk_updated"),
    v.literal("risk_closed"),
    v.literal("policy_created"),
    v.literal("policy_approved"),
    v.literal("policy_acknowledged"),
    v.literal("audit_started"),
    v.literal("audit_completed"),
    v.literal("finding_created"),
    v.literal("finding_remediated"),
    v.literal("finding_closed"),
    v.literal("evidence_collected")
  ),
  entityType: v.union(
    v.literal("control"),
    v.literal("risk"),
    v.literal("policy"),
    v.literal("policy_version"),
    v.literal("audit"),
    v.literal("audit_finding"),
    v.literal("finding_remediation"),
    v.literal("evidence")
  ),
  entityId: v.string(),
  summary: v.string(),
  details: v.optional(v.any()),
})
  .index("by_organization_id", ["orgId"])
  .index("by_actor_id", ["actorId"])
  .index("by_activity_type", ["activityType"])
  .index("by_entity_type", ["entityType"])
  .index("by_entity_id", ["entityId"])
  .index("by_creation_time", ["_creationTime"]);

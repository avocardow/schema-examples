// audit_logs: Immutable event log for security-relevant actions.
// Append-only -- never update or delete rows.
// Uses polymorphic actor/target (not FKs) so logs survive entity deletion.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auditLogs = defineTable({
  // Structured event codes: resource.action.result
  // e.g., "user.login.success", "role.assigned", "session.impersonation.started"
  eventType: v.string(),

  // Polymorphic actor: NOT FKs. Audit logs must survive entity deletion.
  actorType: v.union(
    v.literal("user"),
    v.literal("system"),
    v.literal("api_key"),
    v.literal("service"),
  ),
  actorId: v.optional(v.string()), // user_id, api_key_id, or service name.

  targetType: v.optional(v.string()), // e.g., "user", "organization", "role".
  targetId: v.optional(v.string()),

  organizationId: v.optional(v.id("organizations")),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  metadata: v.optional(v.any()), // Event-specific details.
})
  .index("by_event_type", ["eventType"])
  .index("by_actor", ["actorType", "actorId"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_org_created", ["organizationId", "_creationTime"])
  .index("by_creation_time", ["_creationTime"]);

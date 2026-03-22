// moderation_action_log: Immutable audit trail of moderation events.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderation_action_log = defineTable({
  actorId: v.id("users"), // Who performed the action. Restrict: don't delete users who have audit trail entries.

  actionType: v.string(), // What happened. Not an enum — new action types should not require schema migration.
  targetType: v.string(), // What entity the action was on (e.g., "queue_item", "report", "user", "moderation_rule", "policy").
  targetId: v.string(), // ID of the target entity. Not a FK — target may be any entity type.

  details: v.optional(v.any()), // Event-specific context (e.g., action_taken: {action_type, reason, duration}).
  ipAddress: v.optional(v.string()), // Client IP address for security audit.

  // No updatedAt — actions are immutable (append-only).
  // No createdAt — Convex provides _creationTime.
})
  .index("by_actor_id", ["actorId"])
  .index("by_action_type", ["actionType"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_creation_time", ["_creationTime"]);

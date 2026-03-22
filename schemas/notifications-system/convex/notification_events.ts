// notification_events: Immutable event log — the trigger that causes notifications to be sent.
// One row per occurrence; per-recipient state lives in the notifications table.
// Uses polymorphic actor/target (not FKs) so events survive entity deletion.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_events = defineTable({
  categoryId: v.id("notification_categories"), // What kind of event (e.g., "comments", "billing").

  // Polymorphic actor: who/what triggered this event.
  // Not FKs — actors can be any entity type.
  actorType: v.optional(v.string()), // e.g., "user", "system", "api_key", "service".
  actorId: v.optional(v.string()),

  // Polymorphic target: what was acted upon.
  // Not FKs — targets can be any entity type.
  targetType: v.optional(v.string()), // e.g., "comment", "invoice", "pull_request".
  targetId: v.optional(v.string()),

  // Lightweight grouping for related events (e.g., "issue:456").
  threadKey: v.optional(v.string()),

  // Workflow link; set_null on delete handled at application level.
  workflowId: v.optional(v.id("notification_workflows")),

  data: v.optional(v.any()), // Event payload for rendering notification templates.

  idempotencyKey: v.optional(v.string()), // Unique; prevents duplicate events from the same trigger.

  expiresAt: v.optional(v.number()), // Unix epoch. Null = never expires.

  // No updatedAt — events are immutable (append-only).
})
  .index("by_category_id", ["categoryId"])
  .index("by_actor", ["actorType", "actorId"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_thread_key", ["threadKey"])
  .index("by_creation_time", ["_creationTime"])
  .index("by_idempotency_key", ["idempotencyKey"]);

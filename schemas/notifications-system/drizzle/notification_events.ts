// notification_events: What happened — the trigger that causes notifications to be sent.
// One row per occurrence. Immutable (append-only) — no updated_at.
// Uses polymorphic actor/target (not FKs) so events survive entity deletion.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { notificationCategories } from "./notification_categories";
import { notificationWorkflows } from "./notification_workflows";

export const notificationEvents = pgTable(
  "notification_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // What kind of event this is (e.g., "comments", "billing", "security").
    // Restrict delete: don't orphan events by deleting their category.
    categoryId: uuid("category_id")
      .notNull()
      .references(() => notificationCategories.id, { onDelete: "restrict" }),

    // Polymorphic actor: who/what triggered this event.
    // Follows the Activity Streams 2.0 pattern (actor/verb/object/target).
    actorType: text("actor_type"), // e.g., "user", "system", "api_key", "service". Null for system-generated events.
    actorId: text("actor_id"), // The actor's ID. Not a FK — actors can be any entity type.

    // Polymorphic target: what was acted upon.
    targetType: text("target_type"), // e.g., "comment", "invoice", "pull_request".
    targetId: text("target_id"), // The target's ID. Not a FK — targets can be any entity type.

    // Threading: lightweight grouping for related events.
    threadKey: text("thread_key"), // e.g., "issue:456", "pr:789". Free-form string.

    // Workflow: if this event was triggered via a workflow, link it here.
    workflowId: uuid("workflow_id").references(
      () => notificationWorkflows.id,
      { onDelete: "set null" }
    ),

    // The event payload. Contains all the data needed to render notification templates.
    data: jsonb("data").default(sql`'{}'`),

    // Idempotency: prevent duplicate events from the same trigger.
    idempotencyKey: text("idempotency_key").unique(),

    // Expiration: for time-sensitive events. Null = never expires.
    expiresAt: timestamp("expires_at", { withTimezone: true }),

    // Immutable. Events are append-only — no updated_at.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_notification_events_category_id").on(table.categoryId),
    index("idx_notification_events_actor").on(table.actorType, table.actorId),
    index("idx_notification_events_target").on(
      table.targetType,
      table.targetId
    ),
    index("idx_notification_events_thread_key").on(table.threadKey),
    index("idx_notification_events_created_at").on(table.createdAt),
    // unique(idempotency_key) is already created by the .unique() constraint above.
  ]
);

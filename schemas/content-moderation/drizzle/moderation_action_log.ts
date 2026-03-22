// moderation_action_log: Immutable audit trail of moderation events.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const moderationActionLog = pgTable(
  "moderation_action_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    actionType: text("action_type").notNull(), // What happened. Not an enum — new action types should not require schema migration.
    targetType: text("target_type").notNull(), // What entity the action was on (e.g., "queue_item", "report", "user", "moderation_rule", "policy").
    targetId: text("target_id").notNull(), // ID of the target entity.

    details: jsonb("details"), // Event-specific context (e.g., action_taken: {"action_type": "ban", "reason": "...", "duration": "24h"}).
    ipAddress: text("ip_address"), // Client IP address for security audit.

    // Immutable. Actions are append-only — no updated_at.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_moderation_action_log_actor_id").on(table.actorId),
    index("idx_moderation_action_log_action_type").on(table.actionType),
    index("idx_moderation_action_log_target").on(table.targetType, table.targetId),
    index("idx_moderation_action_log_created_at").on(table.createdAt),
  ]
);

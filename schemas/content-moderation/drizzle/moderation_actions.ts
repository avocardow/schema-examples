// moderation_actions: Enforcement actions taken by moderators or automated systems.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { moderationQueueItems } from "./moderation_queue_items";
import { violationCategories } from "./violation_categories";
import { responseTemplates } from "./response_templates";
import { users } from "../../auth-rbac/drizzle/users";

export const moderationActionTypeEnum = pgEnum("moderation_action_type", [
  "approve",
  "remove",
  "warn",
  "mute",
  "ban",
  "restrict",
  "escalate",
  "label",
]);

export const moderationActionTargetTypeEnum = pgEnum(
  "moderation_action_target_type",
  ["content", "user", "account"]
);

export const moderationActions = pgTable(
  "moderation_actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    queueItemId: uuid("queue_item_id").references(
      () => moderationQueueItems.id,
      { onDelete: "set null" }
    ), // The queue item that prompted this action. Null = proactive action not from queue.

    moderatorId: uuid("moderator_id").references(() => users.id, {
      onDelete: "set null",
    }), // Who took this action. Null = automated action.

    actionType: moderationActionTypeEnum("action_type").notNull(),
    targetType: moderationActionTargetTypeEnum("target_type").notNull(),
    targetId: text("target_id").notNull(), // ID of the action target. String for external ID support.

    reason: text("reason"), // Moderator's explanation of why this action was taken.

    violationCategoryId: uuid("violation_category_id").references(
      () => violationCategories.id,
      { onDelete: "set null" }
    ), // What policy category was violated.

    responseTemplateId: uuid("response_template_id").references(
      () => responseTemplates.id,
      { onDelete: "set null" }
    ), // Canned response used, if any.

    isAutomated: boolean("is_automated").notNull().default(false), // Whether this action was taken by an automated system (DSA requirement).

    metadata: jsonb("metadata").default(sql`'{}'`), // Action-specific details (duration, scope, label text, etc.).

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(), // Actions are immutable — no updated_at.
  },
  (table) => [
    index("idx_moderation_actions_queue_item_id").on(table.queueItemId),
    index("idx_moderation_actions_moderator_id").on(table.moderatorId),
    index("idx_moderation_actions_action_type").on(table.actionType),
    index("idx_moderation_actions_target").on(table.targetType, table.targetId),
    index("idx_moderation_actions_violation_category_id").on(
      table.violationCategoryId
    ),
    index("idx_moderation_actions_is_automated").on(table.isAutomated),
    index("idx_moderation_actions_created_at").on(table.createdAt),
  ]
);

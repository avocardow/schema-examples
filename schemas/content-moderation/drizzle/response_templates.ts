// response_templates: Pre-written response messages for moderator actions.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { violationCategories } from "./violation_categories";
import { users } from "../../auth-rbac/drizzle/users";

export const responseTemplateActionType = pgEnum(
  "response_template_action_type",
  [
    "approve",
    "remove",
    "warn",
    "mute",
    "ban",
    "restrict",
    "escalate",
    "label",
  ]
);

export const responseTemplateScope = pgEnum("response_template_scope", [
  "global",
  "community",
]);

export const responseTemplates = pgTable(
  "response_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // Internal template name (e.g., "Spam Removal — First Offense").
    actionType: responseTemplateActionType("action_type"),
    // Which moderation action this template is for. Null = usable with any action type.
    content: text("content").notNull(),
    // Template text. May include placeholders like {{username}}, {{rule}}, {{appeal_url}}.
    violationCategoryId: uuid("violation_category_id").references(
      () => violationCategories.id,
      { onDelete: "set null" }
    ), // Suggested violation category. Set null: if category is deleted, template remains.
    scope: responseTemplateScope("scope").notNull().default("global"),
    // global = available everywhere. community = specific to one community.
    scopeId: text("scope_id"), // Community ID. Null when scope = global.
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Who created this template.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_response_templates_scope").on(table.scope, table.scopeId),
    index("idx_response_templates_action_type").on(table.actionType),
    index("idx_response_templates_violation_category").on(
      table.violationCategoryId
    ),
    index("idx_response_templates_is_active").on(table.isActive),
  ]
);

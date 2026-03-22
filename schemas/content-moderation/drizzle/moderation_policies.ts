// moderation_policies: Community/platform rule definitions.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { violationCategories } from "./violation_categories";

export const moderationPolicyScopeEnum = pgEnum("moderation_policy_scope", [
  "global",
  "community",
  "channel",
]);

export const moderationPolicies = pgTable(
  "moderation_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    scope: moderationPolicyScopeEnum("scope").notNull().default("global"), // Where this policy applies.
    scopeId: text("scope_id"), // ID of the community/channel. Null when scope = global.

    title: text("title").notNull(), // Short policy title (e.g., "No Hate Speech").
    description: text("description").notNull(), // Full policy text explaining what's prohibited and why.

    violationCategoryId: uuid("violation_category_id").references(
      () => violationCategories.id,
      { onDelete: "set null" }
    ), // Which violation category this policy maps to.

    sortOrder: integer("sort_order").notNull().default(0), // Display ordering within the scope.
    isActive: boolean("is_active").notNull().default(true), // Soft-disable without deleting.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_moderation_policies_scope").on(table.scope, table.scopeId),
    index("idx_moderation_policies_violation_category").on(
      table.violationCategoryId
    ),
    index("idx_moderation_policies_is_active").on(table.isActive),
  ]
);

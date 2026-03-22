// violation_categories: Hierarchical taxonomy of content violation types.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const violationSeverityEnum = pgEnum("violation_severity", [
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);

export const violationCategories = pgTable(
  "violation_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(), // Machine-readable identifier (e.g., "hate_speech", "csam").
    displayName: text("display_name").notNull(), // Human-readable label (e.g., "Hate Speech").
    description: text("description"), // Detailed explanation of what this category covers.
    parentId: uuid("parent_id").references(
      (): any => violationCategories.id,
      { onDelete: "restrict" }
    ), // Parent category for hierarchical taxonomy. Null = top-level category.
    severity: violationSeverityEnum("severity").notNull().default("medium"),
    // info = informational/advisory.
    // low = minor policy violation.
    // medium = standard violation.
    // high = serious violation requiring prompt action.
    // critical = illegal content, imminent harm — highest priority.
    isActive: boolean("is_active").notNull().default(true), // Soft-disable without deleting.
    sortOrder: integer("sort_order").notNull().default(0), // Display ordering within the parent group.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_violation_categories_parent_id").on(table.parentId),
    index("idx_violation_categories_is_active_sort_order").on(
      table.isActive,
      table.sortOrder
    ),
  ]
);

// notification_workflows: Orchestration definitions for multi-step notification delivery.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notificationCategories } from "./notification_categories";

export const notificationWorkflows = pgTable(
  "notification_workflows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // Display name (e.g., "Comment Notification", "Weekly Digest").
    slug: text("slug").unique().notNull(), // Identifier used in code and API (e.g., "comment_notification").
    description: text("description"),

    // Link to the category this workflow handles.
    // A category can have multiple workflows (e.g., immediate + digest versions).
    categoryId: uuid("category_id").references(
      () => notificationCategories.id,
      { onDelete: "set null" }
    ),

    // Critical workflows bypass user preferences entirely.
    // Use sparingly: security alerts, billing failures, legal notices.
    isCritical: boolean("is_critical").notNull().default(false),

    isActive: boolean("is_active").notNull().default(true), // Toggle a workflow without deleting it.

    // The trigger identifier: what your app code calls to fire this workflow.
    // The system matches this value to incoming trigger calls.
    triggerIdentifier: text("trigger_identifier").unique().notNull(), // Must be unique. Used in API/SDK calls.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_workflows_category_id").on(table.categoryId),
    index("idx_notification_workflows_is_active").on(table.isActive),
  ]
);

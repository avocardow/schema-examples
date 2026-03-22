// notification_templates: Reusable content definitions for a notification category, with interpolatable template strings.
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

export const notificationTemplates = pgTable(
  "notification_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => notificationCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // Internal name (e.g., "Comment Created — Default").
    slug: text("slug").unique().notNull(), // Identifier used in code (e.g., "comment_created_default").

    // Default content (channel-agnostic). Used when no channel-specific template_content exists.
    titleTemplate: text("title_template"), // e.g., "New comment on {{issue_title}}"
    bodyTemplate: text("body_template"), // e.g., "{{actor_name}} commented: {{comment_body}}"
    actionUrlTemplate: text("action_url_template"), // e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"

    isActive: boolean("is_active").notNull().default(true), // Toggle without deleting. Inactive templates are skipped during delivery.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_templates_category_id").on(table.categoryId),
  ]
);

// notification_categories: Classification of notification types for organizing user preferences and routing to feeds.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notificationFeeds } from "./notification_feeds";

export const notificationCategories = pgTable(
  "notification_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // Display name (e.g., "Comments", "Billing", "Security Alerts").
    slug: text("slug").unique().notNull(), // Identifier used in code and API (e.g., "comments", "billing", "security").
    description: text("description"), // Explain what triggers notifications in this category.
    color: text("color"), // Hex color for UI display (e.g., "#3B82F6").
    icon: text("icon"), // Icon identifier or URL for UI display.

    // Critical/required notifications bypass user preferences entirely.
    // Users cannot opt out of required categories.
    isRequired: boolean("is_required").notNull().default(false),

    // Default feed: where notifications of this category appear if no category_feeds mapping exists.
    // Null = no default feed (must be explicitly mapped via notification_category_feeds, or appears in all feeds).
    defaultFeedId: uuid("default_feed_id").references(
      () => notificationFeeds.id,
      { onDelete: "set null" }
    ),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_categories_is_required").on(table.isRequired),
  ]
);

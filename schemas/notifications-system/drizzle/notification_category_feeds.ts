// notification_category_feeds: Many-to-many join between categories and feeds.
// See README.md for full design rationale and field documentation.

import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { notificationCategories } from "./notification_categories";
import { notificationFeeds } from "./notification_feeds";

export const notificationCategoryFeeds = pgTable(
  "notification_category_feeds",
  {
    categoryId: uuid("category_id")
      .notNull()
      .references(() => notificationCategories.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => notificationFeeds.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.categoryId, table.feedId] }), // Composite PK. No separate id column needed.
    index("idx_notification_category_feeds_feed_id").on(table.feedId), // "Which categories appear in this feed?" (reverse lookup).
  ]
);

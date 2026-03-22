// notification_category_feeds: Many-to-many junction between categories and feeds.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_category_feeds = defineTable({
  categoryId: v.id("notification_categories"),
  feedId: v.id("notification_feeds"),
})
  .index("by_category_id", ["categoryId"])
  .index("by_feed_id", ["feedId"])
  .index("by_category_feed", ["categoryId", "feedId"]);

// series_items: Ordered post assignments within a content series.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const seriesItems = defineTable({
  seriesId: v.id("series"),
  postId: v.id("posts"),
  sortOrder: v.number(),
})
  .index("by_series_id_post_id", ["seriesId", "postId"])
  .index("by_post_id", ["postId"])
  .index("by_series_id_sort_order", ["seriesId", "sortOrder"]);

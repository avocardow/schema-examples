// hashtags: unique tag names with usage counters for content discovery.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const hashtags = defineTable({
  name: v.string(),
  postCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_name", ["name"])
  .index("by_post_count", ["postCount"]);

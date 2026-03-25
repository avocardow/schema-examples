// kb_articles: self-service knowledge base content with authorship and feedback counters.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const kb_articles = defineTable({
  categoryId: v.optional(v.id("kb_categories")),
  title: v.string(),
  slug: v.string(),
  body: v.string(),
  status: v.union(
    v.literal("draft"),
    v.literal("published"),
    v.literal("archived")
  ),
  authorId: v.id("users"),
  viewCount: v.number(),
  helpfulCount: v.number(),
  notHelpfulCount: v.number(),
  publishedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_category_id", ["categoryId"])
  .index("by_status", ["status"])
  .index("by_author_id", ["authorId"]);

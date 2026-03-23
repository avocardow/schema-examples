// posts: Core content entries supporting posts and pages with SEO metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const posts = defineTable({
  type: v.union(v.literal("post"), v.literal("page")),
  title: v.string(),
  slug: v.string(),
  excerpt: v.optional(v.string()),
  content: v.optional(v.string()),
  featuredImageUrl: v.optional(v.string()),
  status: v.union(
    v.literal("draft"),
    v.literal("scheduled"),
    v.literal("published"),
    v.literal("archived")
  ),
  visibility: v.union(
    v.literal("public"),
    v.literal("private"),
    v.literal("password_protected")
  ),
  password: v.optional(v.string()),
  isFeatured: v.boolean(),
  allowComments: v.boolean(),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  ogImageUrl: v.optional(v.string()),
  publishedAt: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_status_published_at", ["status", "publishedAt"])
  .index("by_type_status", ["type", "status"])
  .index("by_created_by", ["createdBy"])
  .index("by_is_featured", ["isFeatured"]);

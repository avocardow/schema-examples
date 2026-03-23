// post_authors: Many-to-many relationship between posts and authors with roles.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postAuthors = defineTable({
  postId: v.id("posts"),
  authorId: v.id("authors"),
  sortOrder: v.number(),
  role: v.union(
    v.literal("author"),
    v.literal("contributor"),
    v.literal("editor"),
    v.literal("guest")
  ),
})
  .index("by_post_id_author_id", ["postId", "authorId"])
  .index("by_author_id", ["authorId"]);

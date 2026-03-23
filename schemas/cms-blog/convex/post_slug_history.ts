// post_slug_history: Historical slug mappings for redirect support after renames.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const postSlugHistory = defineTable({
  postId: v.id("posts"),
  slug: v.string(),
})
  .index("by_slug", ["slug"])
  .index("by_post_id", ["postId"]);

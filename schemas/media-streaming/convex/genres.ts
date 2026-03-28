// genres: music genre categories.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const genres = defineTable({
  name: v.string(),
  slug: v.string(),
})
  .index("by_name", ["name"])
  .index("by_slug", ["slug"]);

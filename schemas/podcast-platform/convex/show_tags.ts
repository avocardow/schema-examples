// show_tags: tags associated with shows for discovery and categorisation.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const show_tags = defineTable({
  showId: v.id("shows"),
  tag: v.string(),
})
  .index("by_show_id_tag", ["showId", "tag"])
  .index("by_tag", ["tag"]);

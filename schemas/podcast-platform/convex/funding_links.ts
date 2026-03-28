// funding_links: external funding or support URLs associated with a show.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const funding_links = defineTable({
  showId: v.id("shows"),
  url: v.string(),
  title: v.string(),
  position: v.number(),
}).index("by_show_id_position", ["showId", "position"]);

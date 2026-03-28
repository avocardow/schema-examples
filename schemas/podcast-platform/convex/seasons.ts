// seasons: ordered groupings of episodes within a show, identified by number and optional metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const seasons = defineTable({
  showId: v.id("shows"),
  seasonNumber: v.number(),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  artworkFileId: v.optional(v.id("files")),
}).index("by_show_id_season_number", ["showId", "seasonNumber"]);

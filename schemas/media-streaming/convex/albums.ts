// albums: music albums, singles, EPs, and compilations with release metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const albums = defineTable({
  title: v.string(),
  slug: v.string(),
  artistId: v.id("artists"),
  labelId: v.optional(v.id("labels")),
  albumType: v.union(
    v.literal("album"),
    v.literal("single"),
    v.literal("ep"),
    v.literal("compilation")
  ),
  coverFileId: v.optional(v.id("files")),
  releaseDate: v.optional(v.string()),
  totalTracks: v.number(),
  totalDurationMs: v.number(),
  upc: v.optional(v.string()),
  copyright: v.optional(v.string()),
  popularity: v.number(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_artist_id_release_date", ["artistId", "releaseDate"])
  .index("by_label_id", ["labelId"])
  .index("by_album_type_release_date", ["albumType", "releaseDate"])
  .index("by_popularity", ["popularity"])
  .index("by_release_date", ["releaseDate"]);

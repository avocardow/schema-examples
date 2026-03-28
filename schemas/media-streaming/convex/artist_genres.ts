// artist_genres: many-to-many relationship between artists and genres.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const artist_genres = defineTable({
  artistId: v.id("artists"),
  genreId: v.id("genres"),
})
  .index("by_artist_id_genre_id", ["artistId", "genreId"])
  .index("by_genre_id", ["genreId"]);

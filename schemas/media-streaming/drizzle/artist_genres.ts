// artist_genres: Many-to-many relationship between artists and genres.
// See README.md for full design rationale.

import { pgTable, uuid, unique, index } from "drizzle-orm/pg-core";
import { artists } from "./artists";
import { genres } from "./genres";

export const artistGenres = pgTable(
  "artist_genres",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
    genreId: uuid("genre_id").notNull().references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("uq_artist_genres_artist_id_genre_id").on(table.artistId, table.genreId),
    index("idx_artist_genres_genre_id").on(table.genreId),
  ]
);

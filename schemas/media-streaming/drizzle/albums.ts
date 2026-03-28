// albums: Collections of tracks released by an artist.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { artists } from "./artists";
import { labels } from "./labels";
import { files } from "./files";

export const albumTypeEnum = pgEnum("album_type", ["album", "single", "ep", "compilation"]);

export const albums = pgTable(
  "albums",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
    labelId: uuid("label_id").references(() => labels.id, { onDelete: "set null" }),
    albumType: albumTypeEnum("album_type").notNull().default("album"),
    coverFileId: uuid("cover_file_id").references(() => files.id, { onDelete: "set null" }),
    releaseDate: text("release_date"),
    totalTracks: integer("total_tracks").notNull().default(0),
    totalDurationMs: integer("total_duration_ms").notNull().default(0),
    upc: text("upc"),
    copyright: text("copyright"),
    popularity: integer("popularity").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_albums_artist_id_release_date").on(table.artistId, table.releaseDate),
    index("idx_albums_label_id").on(table.labelId),
    index("idx_albums_album_type_release_date").on(table.albumType, table.releaseDate),
    index("idx_albums_popularity").on(table.popularity),
    index("idx_albums_release_date").on(table.releaseDate),
  ]
);

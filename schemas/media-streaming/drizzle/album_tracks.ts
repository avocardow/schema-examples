// album_tracks: Junction table linking tracks to albums with disc and position ordering.
// See README.md for full design rationale.

import { pgTable, uuid, integer, unique, index } from "drizzle-orm/pg-core";
import { albums } from "./albums";
import { tracks } from "./tracks";

export const albumTracks = pgTable(
  "album_tracks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    albumId: uuid("album_id").notNull().references(() => albums.id, { onDelete: "cascade" }),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    discNumber: integer("disc_number").notNull().default(1),
    position: integer("position").notNull(),
  },
  (table) => [
    unique("uq_album_tracks_album_id_disc_number_position").on(table.albumId, table.discNumber, table.position),
    index("idx_album_tracks_track_id").on(table.trackId),
  ]
);

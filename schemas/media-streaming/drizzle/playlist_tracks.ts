// playlist_tracks: Ordered tracks within a playlist, with attribution.
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { playlists } from "./playlists";
import { tracks } from "./tracks";
import { users } from "./users";

export const playlistTracks = pgTable(
  "playlist_tracks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playlistId: uuid("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    addedBy: uuid("added_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_playlist_tracks_playlist_id_position").on(table.playlistId, table.position),
    index("idx_playlist_tracks_track_id").on(table.trackId),
  ]
);

// Join table linking episodes to playlists with ordering
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { playlists } from "./playlists";
import { episodes } from "./episodes";

export const playlistEpisodes = pgTable(
  "playlist_episodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playlistId: uuid("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_playlist_episodes_playlist_id_position").on(table.playlistId, table.position),
    index("idx_playlist_episodes_episode_id").on(table.episodeId),
  ]
);

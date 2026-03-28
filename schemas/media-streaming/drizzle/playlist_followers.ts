// playlist_followers: Users who follow a playlist for updates.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { playlists } from "./playlists";
import { users } from "./users";

export const playlistFollowers = pgTable(
  "playlist_followers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playlistId: uuid("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_playlist_followers_playlist_id_user_id").on(table.playlistId, table.userId),
    index("idx_playlist_followers_user_id_created_at").on(table.userId, table.createdAt),
  ]
);

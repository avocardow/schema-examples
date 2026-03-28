// followed_artists: Artists followed by users for new release notifications.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { artists } from "./artists";

export const followedArtists = pgTable(
  "followed_artists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_followed_artists_user_id_artist_id").on(table.userId, table.artistId),
    index("idx_followed_artists_artist_id").on(table.artistId),
  ]
);

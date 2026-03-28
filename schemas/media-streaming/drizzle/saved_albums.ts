// saved_albums: Albums saved to a user's personal library.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { albums } from "./albums";

export const savedAlbums = pgTable(
  "saved_albums",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    albumId: uuid("album_id").notNull().references(() => albums.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_saved_albums_user_id_album_id").on(table.userId, table.albumId),
    index("idx_saved_albums_user_id_created_at").on(table.userId, table.createdAt),
  ]
);

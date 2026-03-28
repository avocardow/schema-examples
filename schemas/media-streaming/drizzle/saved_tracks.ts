// saved_tracks: Tracks saved to a user's personal library.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tracks } from "./tracks";

export const savedTracks = pgTable(
  "saved_tracks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_saved_tracks_user_id_track_id").on(table.userId, table.trackId),
    index("idx_saved_tracks_user_id_created_at").on(table.userId, table.createdAt),
  ]
);

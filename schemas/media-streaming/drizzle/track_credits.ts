// track_credits: Artist roles and contributions for each track.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, unique, index } from "drizzle-orm/pg-core";
import { tracks } from "./tracks";
import { artists } from "./artists";

export const creditRoleEnum = pgEnum("credit_role", ["primary_artist", "featured_artist", "writer", "producer", "composer", "mixer", "engineer"]);

export const trackCredits = pgTable(
  "track_credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
    role: creditRoleEnum("role").notNull(),
  },
  (table) => [
    unique("uq_track_credits_track_id_artist_id_role").on(table.trackId, table.artistId, table.role),
    index("idx_track_credits_artist_id_role").on(table.artistId, table.role),
  ]
);

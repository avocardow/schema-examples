// tracks: Individual audio tracks available for streaming.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const tracks = pgTable(
  "tracks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    durationMs: integer("duration_ms").notNull(),
    explicit: boolean("explicit").notNull().default(false),
    isrc: text("isrc"),
    popularity: integer("popularity").notNull().default(0),
    previewUrl: text("preview_url"),
    playCount: integer("play_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_tracks_popularity").on(table.popularity),
    index("idx_tracks_play_count").on(table.playCount),
    index("idx_tracks_isrc").on(table.isrc),
    index("idx_tracks_title").on(table.title),
  ]
);

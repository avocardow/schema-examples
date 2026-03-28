// lyrics: Song lyrics with optional time-synced data for karaoke-style display.
// See README.md for full design rationale.

import { pgTable, uuid, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { tracks } from "./tracks";

export const lyrics = pgTable(
  "lyrics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackId: uuid("track_id").unique().notNull().references(() => tracks.id, { onDelete: "cascade" }),
    plainText: text("plain_text"),
    syncedText: jsonb("synced_text"),
    language: text("language"),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_lyrics_language").on(table.language),
  ]
);

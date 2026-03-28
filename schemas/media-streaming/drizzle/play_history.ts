// play_history: Per-user listening history for analytics and recommendations.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tracks } from "./tracks";

export const playContextTypeEnum = pgEnum("play_context_type", ["album", "playlist", "artist", "chart", "search", "queue", "unknown"]);

export const playHistory = pgTable(
  "play_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    durationMs: integer("duration_ms").notNull(),
    completed: boolean("completed").notNull().default(false),
    contextType: playContextTypeEnum("context_type").notNull().default("unknown"),
    contextId: text("context_id"),
    playedAt: timestamp("played_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_play_history_user_id_played_at").on(table.userId, table.playedAt),
    index("idx_play_history_track_id_played_at").on(table.trackId, table.playedAt),
  ]
);

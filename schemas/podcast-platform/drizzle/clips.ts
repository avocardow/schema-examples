// User-created clips from episodes for sharing and highlights
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";
import { users } from "./users";

export const clips = pgTable(
  "clips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    startTimeMs: integer("start_time_ms").notNull(),
    durationMs: integer("duration_ms").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_clips_episode_id").on(table.episodeId),
    index("idx_clips_created_by").on(table.createdBy),
  ]
);

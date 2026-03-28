// Tracks current playback position for each user-episode pair
// See README.md for full design rationale.

import { pgTable, uuid, integer, boolean, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { episodes } from "./episodes";

export const listenProgress = pgTable(
  "listen_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    positionMs: integer("position_ms").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_listen_progress_user_id_episode_id").on(table.userId, table.episodeId),
    index("idx_listen_progress_user_id_completed_updated_at").on(table.userId, table.completed, table.updatedAt),
  ]
);

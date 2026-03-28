// User-managed queue of episodes for sequential playback
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { episodes } from "./episodes";

export const episodeQueue = pgTable(
  "episode_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_episode_queue_user_id_episode_id").on(table.userId, table.episodeId),
    index("idx_episode_queue_user_id_position").on(table.userId, table.position),
  ]
);

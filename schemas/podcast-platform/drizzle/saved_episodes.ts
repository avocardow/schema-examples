// Episodes bookmarked by users for later listening
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { episodes } from "./episodes";

export const savedEpisodes = pgTable(
  "saved_episodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_saved_episodes_user_id_episode_id").on(table.userId, table.episodeId),
    index("idx_saved_episodes_user_id_created_at").on(table.userId, table.createdAt),
  ]
);

// Historical log of listening sessions for analytics and resume playback
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { episodes } from "./episodes";

export const listenSourceEnum = pgEnum("listen_source_enum", ["app", "web", "car", "smart_speaker", "watch", "unknown"]);

export const listenHistory = pgTable(
  "listen_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    positionStartMs: integer("position_start_ms").notNull(),
    positionEndMs: integer("position_end_ms"),
    durationListenedMs: integer("duration_listened_ms").notNull().default(0),
    source: listenSourceEnum("source").notNull().default("unknown"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_listen_history_user_id_started_at").on(table.userId, table.startedAt),
    index("idx_listen_history_episode_id_started_at").on(table.episodeId, table.startedAt),
  ]
);

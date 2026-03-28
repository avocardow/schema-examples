// Chapter markers within an episode for navigation and structure
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";

export const chapters = pgTable(
  "chapters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    startTimeMs: integer("start_time_ms").notNull(),
    endTimeMs: integer("end_time_ms"),
    title: text("title").notNull(),
    url: text("url"),
    imageUrl: text("image_url"),
    isHidden: boolean("is_hidden").notNull().default(false),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_chapters_episode_id_start_time_ms").on(table.episodeId, table.startTimeMs),
  ]
);

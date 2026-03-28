// User subscriptions to podcast shows with personalized playback preferences
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, boolean, numeric, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { shows } from "./shows";

export const newEpisodeSortEnum = pgEnum("new_episode_sort_enum", ["newest_first", "oldest_first"]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    autoDownload: boolean("auto_download").notNull().default(false),
    downloadWifiOnly: boolean("download_wifi_only").notNull().default(true),
    notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
    customPlaybackSpeed: numeric("custom_playback_speed"),
    newEpisodeSort: newEpisodeSortEnum("new_episode_sort").notNull().default("newest_first"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_subscriptions_user_id_show_id").on(table.userId, table.showId),
    index("idx_subscriptions_show_id").on(table.showId),
  ]
);

// Offline episode downloads tracked per user and device
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { episodes } from "./episodes";

export const episodeDownloadStatusEnum = pgEnum("episode_download_status", ["queued", "downloading", "completed", "failed", "expired"]);

export const episodeDownloads = pgTable(
  "episode_downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    status: episodeDownloadStatusEnum("status").notNull().default("queued"),
    deviceId: text("device_id"),
    fileSizeBytes: integer("file_size_bytes"),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_episode_downloads_user_id_episode_id_device_id").on(table.userId, table.episodeId, table.deviceId),
    index("idx_episode_downloads_user_id_status").on(table.userId, table.status),
    index("idx_episode_downloads_expires_at").on(table.expiresAt),
  ]
);

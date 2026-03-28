// downloads: Offline download records linking users to specific track file variants.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tracks } from "./tracks";
import { trackFiles } from "./track_files";

export const downloadStatusEnum = pgEnum("download_status", ["pending", "downloading", "completed", "expired", "failed"]);

export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    trackFileId: uuid("track_file_id").notNull().references(() => trackFiles.id, { onDelete: "cascade" }),
    status: downloadStatusEnum("status").notNull().default("pending"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_downloads_user_id_track_file_id").on(table.userId, table.trackFileId),
    index("idx_downloads_user_id_status").on(table.userId, table.status),
    index("idx_downloads_expires_at").on(table.expiresAt),
  ]
);

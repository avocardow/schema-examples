// asset_downloads: Tracks individual download events for analytics and auditing.
// See README.md for full design rationale.

import { pgTable, uuid, text, bigint, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { assets } from "./assets";
import { shareLinks } from "./share_links";
import { downloadPresets } from "./download_presets";

export const assetDownloads = pgTable(
  "asset_downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    downloadedBy: uuid("downloaded_by").references(() => users.id, { onDelete: "set null" }),
    shareLinkId: uuid("share_link_id").references(() => shareLinks.id, { onDelete: "set null" }),
    presetId: uuid("preset_id").references(() => downloadPresets.id, { onDelete: "set null" }),
    format: text("format").notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_asset_downloads_asset_id").on(table.assetId),
    index("idx_asset_downloads_downloaded_by").on(table.downloadedBy),
    index("idx_asset_downloads_downloaded_at").on(table.downloadedAt),
  ]
);

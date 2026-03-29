// asset_versions: Tracks versioned file uploads for each asset.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, bigint, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { assets } from "./assets";

export const assetVersions = pgTable(
  "asset_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    fileExtension: text("file_extension").notNull(),
    checksumSha256: text("checksum_sha256"),
    changeSummary: text("change_summary"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_asset_versions_asset_id_version_number").on(table.assetId, table.versionNumber),
  ]
);

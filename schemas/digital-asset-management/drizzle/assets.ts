// assets: Core table storing digital asset metadata and file information.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, numeric, bigint, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";
import { folders } from "./folders";

export const assetTypeEnum = pgEnum("asset_type", [
  "image",
  "video",
  "audio",
  "document",
  "font",
  "archive",
  "other",
]);

export const assetStatusEnum = pgEnum("asset_status", [
  "draft",
  "active",
  "archived",
  "expired",
]);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => folders.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    originalFilename: text("original_filename").notNull(),
    description: text("description"),
    storageKey: text("storage_key").unique().notNull(),
    mimeType: text("mime_type").notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    fileExtension: text("file_extension").notNull(),
    assetType: assetTypeEnum("asset_type").notNull(),
    status: assetStatusEnum("status").notNull().default("draft"),
    // NOTE: Circular FK — cannot use .references() here
    currentVersionId: uuid("current_version_id"),
    versionCount: integer("version_count").notNull().default(1),
    width: integer("width"),
    height: integer("height"),
    durationSeconds: numeric("duration_seconds"),
    colorSpace: text("color_space"),
    dpi: integer("dpi"),
    uploadedBy: uuid("uploaded_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    checksumSha256: text("checksum_sha256"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_assets_workspace_id_folder_id").on(table.workspaceId, table.folderId),
    index("idx_assets_workspace_id_asset_type").on(table.workspaceId, table.assetType),
    index("idx_assets_workspace_id_status").on(table.workspaceId, table.status),
    index("idx_assets_uploaded_by").on(table.uploadedBy),
    index("idx_assets_mime_type").on(table.mimeType),
  ]
);

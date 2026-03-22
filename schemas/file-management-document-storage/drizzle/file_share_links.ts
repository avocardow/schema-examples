// file_share_links: URL-based sharing with optional password protection, expiry, and download tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { files } from "./files";
import { folders } from "./folders";
import { users } from "../../auth-rbac/drizzle/users";

export const fileShareLinkTargetType = pgEnum("file_share_link_target_type", [
  "file",
  "folder",
]);

export const fileShareLinkScope = pgEnum("file_share_link_scope", [
  "anyone",
  "organization",
  "specific_users",
]);

export const fileShareLinkPermission = pgEnum("file_share_link_permission", [
  "view",
  "download",
  "edit",
  "upload",
]);

export const fileShareLinks = pgTable(
  "file_share_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // What the link accesses. Exactly one of targetFileId or targetFolderId must be set.
    targetType: fileShareLinkTargetType("target_type").notNull(),
    targetFileId: uuid("target_file_id").references(() => files.id, {
      onDelete: "cascade",
    }), // Populated when targetType = 'file'.
    targetFolderId: uuid("target_folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }), // Populated when targetType = 'folder'.

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    token: text("token").unique().notNull(), // URL-safe token for the share link.
    scope: fileShareLinkScope("scope").notNull().default("anyone"),
    permission: fileShareLinkPermission("permission").notNull().default("view"),
    passwordHash: text("password_hash"), // Hashed — never store plaintext.
    expiresAt: timestamp("expires_at", { withTimezone: true }), // Null = never expires.
    maxDownloads: integer("max_downloads"), // Null = unlimited.
    downloadCount: integer("download_count").notNull().default(0), // Increment atomically on each download.
    name: text("name"), // Human-readable name (e.g., "Client review link").
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_file_share_links_target_file").on(
      table.targetType,
      table.targetFileId
    ),
    index("idx_file_share_links_target_folder").on(
      table.targetType,
      table.targetFolderId
    ),
    index("idx_file_share_links_created_by").on(table.createdBy),
    index("idx_file_share_links_expires_at").on(table.expiresAt),
  ]
);

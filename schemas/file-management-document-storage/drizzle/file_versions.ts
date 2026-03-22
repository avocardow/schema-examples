// file_versions: Immutable version history for files — each row is a point-in-time snapshot with its own storage key.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "../../auth-rbac/drizzle/users";

export const fileVersions = pgTable(
  "file_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(), // Monotonic counter per file: 1, 2, 3, ...
    storageKey: text("storage_key").unique().notNull(), // Path to this version's bytes.
    size: bigint("size", { mode: "number" }).notNull(), // This version's file size in bytes.
    checksumSha256: text("checksum_sha256"), // This version's content hash.
    mimeType: text("mime_type").notNull(), // This version's MIME type. May differ between versions.
    changeSummary: text("change_summary"), // Human-readable description of what changed.

    // Denormalized flag: true for the active version.
    // Kept in sync with files.current_version_id.
    isCurrent: boolean("is_current").notNull().default(false),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // No updatedAt — versions are immutable (append-only).
  },
  (table) => [
    uniqueIndex("idx_file_versions_file_id_version_number").on(table.fileId, table.versionNumber),
    index("idx_file_versions_file_id_is_current").on(table.fileId, table.isCurrent),
  ]
);

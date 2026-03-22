// files: Core file entity — metadata about stored bytes (the "blob" in the blob + attachment split).
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  bigint,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { storageBuckets } from "./storage_buckets";
import { folders } from "./folders";
import { users } from "../../auth-rbac/drizzle/users";

export const files = pgTable(
  "files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucketId: uuid("bucket_id")
      .notNull()
      .references(() => storageBuckets.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "set null",
    }), // Null = bucket root (no folder).

    // Identity and display
    name: text("name").notNull(), // Current display filename (e.g., "Q4 Report.pdf").
    originalFilename: text("original_filename").notNull(), // Filename at upload time. Never changes after upload.
    storageKey: text("storage_key").unique().notNull(), // Path to bytes in the storage backend. Immutable after upload.

    // File properties
    mimeType: text("mime_type").notNull(), // MIME type (e.g., "application/pdf", "image/png").
    size: bigint("size", { mode: "number" }).notNull(), // File size in bytes. BIGINT supports files >2GB.
    checksumSha256: text("checksum_sha256"), // SHA-256 hash for duplicate detection and integrity verification.
    etag: text("etag"), // HTTP ETag for cache validation.

    // Versioning: pointer to the current active version.
    // Null until the first version is explicitly created (versioning may be off for the bucket).
    // NOTE: Circular FK — file_versions.file_id → files.id. Cannot use .references() here to avoid circular import.
    // Add FK via ALTER TABLE: ALTER TABLE files ADD CONSTRAINT fk_files_current_version FOREIGN KEY (current_version_id) REFERENCES file_versions(id) ON DELETE SET NULL;
    currentVersionId: uuid("current_version_id"),

    // Metadata
    metadata: jsonb("metadata").default(sql`'{}'`), // System-extracted metadata (dimensions, duration, pages, EXIF).
    userMetadata: jsonb("user_metadata").default(sql`'{}'`), // User-defined key-value pairs.

    // Ownership
    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    isPublic: boolean("is_public").notNull().default(false),

    // Soft delete
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedBy: uuid("deleted_by").references(() => users.id, {
      onDelete: "set null",
    }),
    originalFolderId: uuid("original_folder_id").references(
      () => folders.id,
      { onDelete: "set null" }
    ),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_files_bucket_folder").on(table.bucketId, table.folderId),
    index("idx_files_uploaded_by").on(table.uploadedBy),
    index("idx_files_mime_type").on(table.mimeType),
    index("idx_files_deleted_at").on(table.deletedAt),
    index("idx_files_checksum_sha256").on(table.checksumSha256),
    index("idx_files_bucket_deleted_at").on(table.bucketId, table.deletedAt),
  ]
);

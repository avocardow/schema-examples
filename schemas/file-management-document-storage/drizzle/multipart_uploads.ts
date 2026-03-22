// multipart_uploads: Resumable upload session tracking — lifecycle management from initiation to completion or expiry.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  bigint,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { storageBuckets } from "./storage_buckets";
import { users } from "../../auth-rbac/drizzle/users";

export const multipartUploadStatusEnum = pgEnum("multipart_upload_status", [
  "in_progress",
  "completing",
  "completed",
  "aborted",
  "expired",
]);

export const multipartUploadTypeEnum = pgEnum("multipart_upload_type", [
  "single",
  "multipart",
  "resumable",
]);

export const multipartUploads = pgTable(
  "multipart_uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucketId: uuid("bucket_id")
      .notNull()
      .references(() => storageBuckets.id, { onDelete: "cascade" }),
    storageKey: text("storage_key").notNull(), // Intended storage path for the completed file.
    filename: text("filename").notNull(), // Intended filename for the completed file.
    mimeType: text("mime_type"), // Expected MIME type. Nullable: may not be known at initiation.
    totalSize: bigint("total_size", { mode: "number" }), // Expected total size in bytes. Nullable: tus supports Upload-Defer-Length.
    uploadedSize: bigint("uploaded_size", { mode: "number" }).notNull().default(0), // Bytes received so far.
    partCount: integer("part_count").notNull().default(0), // Number of parts received so far.

    status: multipartUploadStatusEnum("status").notNull().default("in_progress"),
    uploadType: multipartUploadTypeEnum("upload_type").notNull().default("single"),
    metadata: jsonb("metadata").default(sql`'{}'`), // Upload metadata key-value pairs from the client.

    initiatedBy: uuid("initiated_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), // Server-set expiry for cleanup. Always set.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_multipart_uploads_bucket_id_status").on(table.bucketId, table.status),
    index("idx_multipart_uploads_initiated_by").on(table.initiatedBy),
    index("idx_multipart_uploads_expires_at_status").on(table.expiresAt, table.status),
    index("idx_multipart_uploads_status").on(table.status),
  ]
);

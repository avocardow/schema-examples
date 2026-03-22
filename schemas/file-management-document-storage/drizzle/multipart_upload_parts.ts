// multipart_upload_parts: Individual parts of a multipart upload, assembled into the final file on completion.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  integer,
  bigint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { multipartUploads } from "./multipart_uploads";

export const multipartUploadParts = pgTable(
  "multipart_upload_parts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    uploadId: uuid("upload_id")
      .notNull()
      .references(() => multipartUploads.id, { onDelete: "cascade" }),

    partNumber: integer("part_number").notNull(), // 1-based ordering. Parts are assembled in part_number order.

    size: bigint("size", { mode: "number" }).notNull(), // This part's size in bytes.

    checksum: text("checksum"), // Per-part integrity hash (e.g., MD5, CRC32).

    storageKey: text("storage_key").notNull(), // Temporary storage location for this part.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_multipart_upload_parts_upload_id_part_number").on(
      table.uploadId,
      table.partNumber
    ),
  ]
);

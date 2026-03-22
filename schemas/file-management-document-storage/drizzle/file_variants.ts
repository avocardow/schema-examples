// file_variants: Thumbnails, resized images, and transformed derivatives of a source file.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  jsonb,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { files } from "./files";

export const fileVariants = pgTable(
  "file_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceFileId: uuid("source_file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }), // The original file this variant was generated from.
    variantKey: text("variant_key").notNull(), // Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").
    storageKey: text("storage_key").unique().notNull(), // Path to the variant's bytes.
    mimeType: text("mime_type").notNull(), // May differ from source (e.g., JPEG source → WebP variant).
    width: integer("width"), // Variant width in pixels. Null for non-image variants.
    height: integer("height"), // Variant height in pixels. Null for non-image variants.
    size: bigint("size", { mode: "number" }).notNull(), // Variant file size in bytes.
    transformParams: jsonb("transform_params"), // The transformation parameters that produced this variant.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // No updatedAt — variants are immutable.
  },
  (table) => [
    unique("uq_file_variants_source_file_id_variant_key").on(table.sourceFileId, table.variantKey),
  ]
);

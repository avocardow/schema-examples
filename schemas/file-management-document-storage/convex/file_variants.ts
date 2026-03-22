// file_variants: Thumbnails, resized images, and transformed derivatives of a source file.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_variants = defineTable({
  sourceFileId: v.id("files"), // The original file this variant was generated from. Cascade: deleting the source removes all its variants.
  variantKey: v.string(), // Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").
  storageKey: v.string(), // Path to the variant's bytes. Separate from the source's storage key.
  mimeType: v.string(), // May differ from source (e.g., JPEG source → WebP variant).
  width: v.optional(v.number()), // Variant width in pixels. Null for non-image variants.
  height: v.optional(v.number()), // Variant height in pixels. Null for non-image variants.
  size: v.number(), // Variant file size in bytes.
  transformParams: v.optional(v.any()), // The transformation parameters that produced this variant.
  // no createdAt — Convex provides _creationTime
  // no updatedAt — variants are immutable
})
  .index("by_source_file_id", ["sourceFileId"])
  .index("by_source_file_id_variant_key", ["sourceFileId", "variantKey"])
  .index("by_storage_key", ["storageKey"]);

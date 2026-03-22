// file_variants: Thumbnails, resized images, and transformed derivatives of a source file.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "file_variants"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each variant is a first-class record with its own storage key, dimensions, and size.
 * Variants are immutable — to update, delete and regenerate.
 *
 * Composite unique: (sourceFileId, variantKey) — one variant per key per source file.
 * Enforce uniqueness in application code or with Cloud Functions.
 */

/**
 * @typedef {Object} FileVariantDocument
 * @property {string}      sourceFileId    - Reference to the source files document.
 * @property {string}      variantKey      - Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").
 * @property {string}      storageKey      - Path to the variant's bytes. Unique across all variants.
 * @property {string}      mimeType        - May differ from source (e.g., JPEG source → WebP variant).
 * @property {number|null} width           - Variant width in pixels. Null for non-image variants.
 * @property {number|null} height          - Variant height in pixels. Null for non-image variants.
 * @property {number}      size            - Variant file size in bytes.
 * @property {Object|null} transformParams - The transformation parameters that produced this variant.
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<FileVariantDocument, "sourceFileId" | "variantKey" | "storageKey" | "mimeType" | "size"> & Partial<Pick<FileVariantDocument, "width" | "height" | "transformParams">>} fields
 * @returns {Omit<FileVariantDocument, "id">}
 */
export function createFileVariant(fields) {
  return {
    sourceFileId:    fields.sourceFileId,
    variantKey:      fields.variantKey,
    storageKey:      fields.storageKey,
    mimeType:        fields.mimeType,
    width:           fields.width           ?? null,
    height:          fields.height          ?? null,
    size:            fields.size,
    transformParams: fields.transformParams ?? null,
    createdAt:       Timestamp.now(),
    // No updatedAt — variants are immutable.
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("file_variants").withConverter(fileVariantConverter)
 */
export const fileVariantConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      sourceFileId:    data.sourceFileId,
      variantKey:      data.variantKey,
      storageKey:      data.storageKey,
      mimeType:        data.mimeType,
      width:           data.width           ?? null,
      height:          data.height          ?? null,
      size:            data.size,
      transformParams: data.transformParams ?? null,
      createdAt:       data.createdAt,       // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - file_variants.sourceFileId  ASC  — Find all variants for a source file.
 *   - file_variants.storageKey    ASC  — Unique lookup by storage key.
 *
 * Composite:
 *   - file_variants (sourceFileId ASC, variantKey ASC) — Unique: one variant per key per source file.
 */

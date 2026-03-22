-- file_variants: Thumbnails, resized images, and transformed derivatives of a source file.
-- See README.md for full design rationale.

CREATE TABLE file_variants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_file_id    UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                 -- The original file this variant was generated from.
                                                 -- Cascade: deleting the source removes all its variants.
  variant_key       TEXT NOT NULL,               -- Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").
  storage_key       TEXT UNIQUE NOT NULL,         -- Path to the variant's bytes. Separate from the source's storage key.
  mime_type         TEXT NOT NULL,               -- May differ from source (e.g., JPEG source → WebP variant).
  width             INTEGER,                     -- Variant width in pixels. Null for non-image variants.
  height            INTEGER,                     -- Variant height in pixels. Null for non-image variants.
  size              BIGINT NOT NULL,             -- Variant file size in bytes.
  transform_params  JSONB,                       -- The transformation parameters that produced this variant.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at — variants are immutable. To update, delete and regenerate.
);

CREATE UNIQUE INDEX idx_file_variants_source_file_id_variant_key ON file_variants (source_file_id, variant_key);

-- files: Core file entity — metadata about stored bytes (the "blob" in the blob + attachment split).
-- See README.md for full design rationale.

CREATE TABLE files (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id           UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
  folder_id           UUID REFERENCES folders(id) ON DELETE SET NULL,

  -- Identity and display
  name                TEXT NOT NULL,                    -- Current display filename (e.g., "Q4 Report.pdf").
  original_filename   TEXT NOT NULL,                    -- Filename at upload time. Preserved for audit/history.
  storage_key         TEXT UNIQUE NOT NULL,             -- Path to bytes in the storage backend. Immutable after upload.

  -- File properties
  mime_type           TEXT NOT NULL,                    -- MIME type (e.g., "application/pdf", "image/png").
  size                BIGINT NOT NULL,                  -- File size in bytes. BIGINT supports files >2GB.
  checksum_sha256     TEXT,                             -- SHA-256 hash. Enables duplicate detection, integrity verification.
  etag                TEXT,                             -- HTTP ETag for cache validation.

  -- Versioning: pointer to the current active version.
  -- Null until the first version is explicitly created (versioning may be off for the bucket).
  -- NOTE: FK to file_versions added via ALTER TABLE below (circular reference: file_versions.file_id → files.id).
  current_version_id  UUID,

  -- Metadata (JSONB for indexable, queryable JSON in PostgreSQL).
  metadata            JSONB DEFAULT '{}',              -- System-extracted metadata (dimensions, duration, pages, EXIF).
  user_metadata       JSONB DEFAULT '{}',              -- User-defined key-value pairs.

  -- Ownership
  uploaded_by         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_public           BOOLEAN NOT NULL DEFAULT FALSE,  -- Per-file public access override.

  -- Soft delete
  deleted_at          TIMESTAMPTZ,                     -- When the file was trashed. Null = not deleted.
  deleted_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  original_folder_id  UUID REFERENCES folders(id) ON DELETE SET NULL,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Circular FK: files.current_version_id → file_versions.id.
-- Added separately because file_versions references files(id), creating a circular dependency.
ALTER TABLE files
  ADD CONSTRAINT fk_files_current_version
  FOREIGN KEY (current_version_id) REFERENCES file_versions(id) ON DELETE SET NULL;

CREATE INDEX idx_files_bucket_folder ON files (bucket_id, folder_id);
CREATE INDEX idx_files_uploaded_by ON files (uploaded_by);
CREATE INDEX idx_files_mime_type ON files (mime_type);
CREATE INDEX idx_files_deleted_at ON files (deleted_at);
CREATE INDEX idx_files_checksum_sha256 ON files (checksum_sha256);
CREATE INDEX idx_files_bucket_deleted_at ON files (bucket_id, deleted_at);

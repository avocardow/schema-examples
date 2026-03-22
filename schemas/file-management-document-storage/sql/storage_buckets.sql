-- storage_buckets: Logical containers for files with per-bucket configuration and upload constraints.
-- See README.md for full design rationale.

CREATE TABLE storage_buckets (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT UNIQUE NOT NULL,              -- Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).
  description         TEXT,                              -- Explain what this bucket is for.

  -- Controls anonymous read access to files in this bucket.
  -- false = all access requires authentication.
  -- true = files are publicly readable (e.g., CDN-served assets).
  is_public           BOOLEAN NOT NULL DEFAULT FALSE,

  allowed_mime_types  TEXT[],                            -- Whitelist of accepted MIME types. Null = all types allowed.
  max_file_size       BIGINT,                           -- Maximum file size in bytes. Null = no limit.

  -- Whether files in this bucket track version history.
  -- When true, uploading a new version creates a file_versions record instead of replacing the file.
  versioning_enabled  BOOLEAN NOT NULL DEFAULT FALSE,

  created_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

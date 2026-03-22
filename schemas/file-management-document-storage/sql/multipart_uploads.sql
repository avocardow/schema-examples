-- multipart_uploads: Resumable upload session tracking — lifecycle management from initiation to completion or expiry.
-- See README.md for full design rationale.

CREATE TYPE multipart_upload_status AS ENUM ('in_progress', 'completing', 'completed', 'aborted', 'expired');
CREATE TYPE multipart_upload_type AS ENUM ('single', 'multipart', 'resumable');

CREATE TABLE multipart_uploads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id         UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
  storage_key       TEXT NOT NULL,                    -- Intended storage path for the completed file.
  filename          TEXT NOT NULL,                    -- Intended filename for the completed file.
  mime_type         TEXT,                             -- Expected MIME type. Nullable: may not be known at initiation.
  total_size        BIGINT,                          -- Expected total size in bytes. Nullable: tus supports Upload-Defer-Length.
  uploaded_size     BIGINT NOT NULL DEFAULT 0,       -- Bytes received so far. Progress = uploaded_size / total_size.
  part_count        INTEGER NOT NULL DEFAULT 0,      -- Number of parts received so far.

  status            multipart_upload_status NOT NULL DEFAULT 'in_progress',
  upload_type       multipart_upload_type NOT NULL DEFAULT 'single',
  metadata          JSONB DEFAULT '{}',              -- Upload metadata key-value pairs from the client.

  initiated_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  expires_at        TIMESTAMPTZ NOT NULL,            -- Server-set expiry for cleanup. Always set.

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_multipart_uploads_bucket_id_status ON multipart_uploads (bucket_id, status);
CREATE INDEX idx_multipart_uploads_initiated_by ON multipart_uploads (initiated_by);
CREATE INDEX idx_multipart_uploads_expires_at_status ON multipart_uploads (expires_at, status);
CREATE INDEX idx_multipart_uploads_status ON multipart_uploads (status);

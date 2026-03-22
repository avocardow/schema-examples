-- multipart_upload_parts: Individual parts of a multipart upload, assembled into the final file on completion.
-- See README.md for full design rationale and field documentation.

CREATE TABLE multipart_upload_parts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id         UUID NOT NULL REFERENCES multipart_uploads(id) ON DELETE CASCADE,
                                                   -- The upload session this part belongs to.
                                                   -- Cascade: aborting/deleting an upload removes all its parts.
  part_number       INTEGER NOT NULL,              -- 1-based ordering. Parts are assembled in part_number order.

  size              BIGINT NOT NULL,               -- This part's size in bytes.

  checksum          TEXT,                           -- Per-part integrity hash (e.g., MD5, CRC32).
                                                   -- S3 returns this as the part's ETag.
  storage_key       TEXT NOT NULL,                  -- Temporary storage location for this part.
                                                   -- Cleaned up after assembly into the final file.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (upload_id, part_number)                  -- Part numbers are unique within an upload.
);

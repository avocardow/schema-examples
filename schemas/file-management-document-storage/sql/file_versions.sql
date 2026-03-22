-- file_versions: Immutable version history for files — each row is a point-in-time snapshot with its own storage key.
-- See README.md for full design rationale and field documentation.

CREATE TABLE file_versions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id           UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                 -- Which file this version belongs to.
                                                 -- Cascade: deleting a file removes all its versions.
  version_number    INTEGER NOT NULL,            -- Monotonic counter per file: 1, 2, 3, ...
  storage_key       TEXT UNIQUE NOT NULL,        -- Path to this version's bytes. Each version has its own storage location.
  size              BIGINT NOT NULL,             -- This version's file size in bytes.
  checksum_sha256   TEXT,                        -- This version's content hash.
  mime_type         TEXT NOT NULL,               -- This version's MIME type. May differ between versions.
  change_summary    TEXT,                        -- Human-readable description of what changed in this version.

  -- Denormalized flag: true for the active version.
  -- Kept in sync with files.current_version_id.
  is_current        BOOLEAN NOT NULL DEFAULT FALSE,

  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                 -- Who uploaded this version.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at — versions are immutable (append-only).
);

CREATE UNIQUE INDEX idx_file_versions_file_id_version_number ON file_versions (file_id, version_number);
CREATE INDEX idx_file_versions_file_id_is_current ON file_versions (file_id, is_current);

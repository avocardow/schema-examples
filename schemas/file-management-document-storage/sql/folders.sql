-- folders: Folder tree with materialized path for efficient subtree queries.
-- See README.md for full design rationale.

CREATE TABLE folders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id         UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
  parent_id         UUID REFERENCES folders(id) ON DELETE CASCADE, -- Null = root-level folder within the bucket.
  name              TEXT NOT NULL,                    -- Display name (e.g., "Documents", "Photos 2024").

  -- Materialized path using folder IDs as segments.
  -- Format: /{parent_uuid}/{this_uuid}/ (e.g., "/abc123/def456/").
  -- Root folders: /{this_uuid}/
  -- Enables subtree queries: WHERE path LIKE '/abc123/%'
  -- Uses UUIDs (not names) so folder renames don't cascade path updates.
  path              TEXT NOT NULL,

  depth             INTEGER NOT NULL DEFAULT 0,       -- Hierarchy level. 0 = root, 1 = child of root, etc.
  description       TEXT,
  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_folders_bucket_id_path ON folders (bucket_id, path);

-- Folder name must be unique within a parent directory inside a bucket.
-- ⚠️  parent_id is nullable. In SQL, NULL != NULL, so this unique index
--     does NOT prevent duplicate root folder names within a bucket.
--     Use the partial index below to cover the parent_id IS NULL case.
CREATE UNIQUE INDEX idx_folders_bucket_id_parent_id_name ON folders (bucket_id, parent_id, name);
CREATE UNIQUE INDEX idx_folders_bucket_id_name_root ON folders (bucket_id, name) WHERE parent_id IS NULL;

CREATE INDEX idx_folders_parent_id ON folders (parent_id);
CREATE INDEX idx_folders_bucket_id_depth ON folders (bucket_id, depth);

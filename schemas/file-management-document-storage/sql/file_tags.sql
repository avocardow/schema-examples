-- file_tags: Tag definitions for organizing files with visibility levels (public, private, system).
-- See README.md for full design rationale.

CREATE TYPE file_tag_visibility AS ENUM ('public', 'private', 'system');

CREATE TABLE file_tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL,              -- Tag name (e.g., "important", "reviewed", "needs-update").
  color           TEXT,                              -- Hex color for UI display (e.g., "#ff5733").

  -- public = visible to all users.
  -- private = visible only to the creator.
  -- system = admin-managed, visible to all but only admins can assign.
  visibility      file_tag_visibility NOT NULL DEFAULT 'public',

  description     TEXT,                              -- Explain what this tag means or when to use it.
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_file_tags_visibility ON file_tags (visibility);

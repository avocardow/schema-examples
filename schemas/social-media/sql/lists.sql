-- lists: Curated lists of users for organized timeline viewing.
-- See README.md for full design rationale and field documentation.

CREATE TABLE lists (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  is_private   BOOLEAN NOT NULL DEFAULT TRUE,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lists_owner_id ON lists (owner_id);

-- blocks: User-to-user block relationships.
-- See README.md for full design rationale and field documentation.

CREATE TABLE blocks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id)
);

CREATE INDEX idx_blocks_blocked_id ON blocks (blocked_id);

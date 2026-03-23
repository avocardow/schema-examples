-- mutes: Temporary or permanent muting of other users.
-- See README.md for full design rationale and field documentation.

CREATE TABLE mutes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  muter_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  muted_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (muter_id, muted_id)
);

CREATE INDEX idx_mutes_muted_id ON mutes (muted_id);
CREATE INDEX idx_mutes_expires_at ON mutes (expires_at);

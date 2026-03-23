-- follows: Directional follow relationships between users.
-- See README.md for full design rationale and field documentation.

CREATE TABLE follows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  notify        BOOLEAN NOT NULL DEFAULT FALSE,
  show_reposts  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id)
);

CREATE INDEX idx_follows_following_id ON follows (following_id);

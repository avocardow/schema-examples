-- reposts: Shares of existing posts to a user's timeline.
-- See README.md for full design rationale and field documentation.

CREATE TABLE reposts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX idx_reposts_user_id_created_at ON reposts (user_id, created_at);

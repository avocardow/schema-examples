-- poll_votes: Individual vote records for poll options.
-- See README.md for full design rationale and field documentation.

CREATE TABLE poll_votes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id      UUID NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, user_id, option_index)
);

CREATE INDEX idx_poll_votes_user_id ON poll_votes (user_id);

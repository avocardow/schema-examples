-- poll_responses: Individual user responses to meeting polls.
-- See README.md for full design rationale and field documentation.

CREATE TABLE poll_responses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id           UUID NOT NULL REFERENCES meeting_polls (id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  selected_options  JSONB NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (poll_id, user_id)
);

CREATE INDEX idx_poll_responses_user_id ON poll_responses (user_id);

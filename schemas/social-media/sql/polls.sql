-- polls: Polls attached to posts with configurable options and expiry.
-- See README.md for full design rationale and field documentation.

CREATE TABLE polls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  allows_multiple BOOLEAN NOT NULL DEFAULT FALSE,
  options         JSONB NOT NULL,
  vote_count      INTEGER NOT NULL DEFAULT 0,
  voter_count     INTEGER NOT NULL DEFAULT 0,
  closes_at       TIMESTAMPTZ,
  is_closed       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_polls_author_id ON polls (author_id);
CREATE INDEX idx_polls_closes_at ON polls (closes_at);

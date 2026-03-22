-- anonymous_ids: Maps anonymous visitor identifiers to authenticated users after identification.
-- See README.md for full design rationale.

CREATE TABLE anonymous_ids (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id  TEXT NOT NULL,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_seen_at TIMESTAMPTZ NOT NULL,
  identified_at TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (anonymous_id, user_id)
);

CREATE INDEX idx_anonymous_ids_user_id ON anonymous_ids (user_id);
CREATE INDEX idx_anonymous_ids_anonymous_id ON anonymous_ids (anonymous_id);

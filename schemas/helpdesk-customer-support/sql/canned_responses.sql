-- canned_responses: Pre-written reply templates agents can insert into ticket messages.
-- See README.md for full design rationale.

CREATE TABLE canned_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  content       TEXT NOT NULL,
  folder        TEXT,
  created_by_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  is_shared     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_canned_responses_created_by_id ON canned_responses (created_by_id);
CREATE INDEX idx_canned_responses_is_shared ON canned_responses (is_shared);
CREATE INDEX idx_canned_responses_folder ON canned_responses (folder);

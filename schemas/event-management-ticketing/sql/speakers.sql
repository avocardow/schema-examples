-- speakers: Presenter profiles with biographical and contact information.
-- See README.md for full design rationale.

CREATE TABLE speakers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users (id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  email               TEXT,
  bio                 TEXT,
  title               TEXT,
  company             TEXT,
  avatar_url          TEXT,
  website_url         TEXT,
  twitter_handle      TEXT,
  linkedin_url        TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_speakers_user_id ON speakers (user_id);
CREATE INDEX idx_speakers_is_active ON speakers (is_active);

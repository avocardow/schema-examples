-- profiles: Public-facing user profile with display info and social counters.
-- See README.md for full design rationale and field documentation.

CREATE TABLE profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  display_name    TEXT,
  bio             TEXT,
  avatar_file_id  UUID REFERENCES files (id) ON DELETE SET NULL,
  banner_file_id  UUID REFERENCES files (id) ON DELETE SET NULL,
  website         TEXT,
  location        TEXT,
  is_private      BOOLEAN NOT NULL DEFAULT FALSE,
  follower_count  INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  post_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_is_private ON profiles (is_private);

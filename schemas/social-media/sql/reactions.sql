-- reactions: Typed reactions (like, love, etc.) on posts.
-- See README.md for full design rationale and field documentation.

CREATE TYPE reaction_type AS ENUM ('like', 'love', 'celebrate', 'insightful', 'funny');

CREATE TABLE reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type       reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id, type)
);

CREATE INDEX idx_reactions_user_id ON reactions (user_id);

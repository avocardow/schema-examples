-- mentions: Records of users mentioned in posts.
-- See README.md for full design rationale and field documentation.

CREATE TABLE mentions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id           UUID NOT NULL,
  mentioned_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, mentioned_user_id)
);

-- Forward FK: posts loads after mentions alphabetically.
ALTER TABLE mentions
  ADD CONSTRAINT fk_mentions_post_id
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

CREATE INDEX idx_mentions_mentioned_user_id_created_at ON mentions (mentioned_user_id, created_at);

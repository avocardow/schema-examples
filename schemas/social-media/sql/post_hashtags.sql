-- post_hashtags: Many-to-many link between posts and hashtags.
-- See README.md for full design rationale and field documentation.

CREATE TABLE post_hashtags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL,
  hashtag_id UUID NOT NULL REFERENCES hashtags (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, hashtag_id)
);

-- Forward FK: posts loads after post_hashtags alphabetically.
ALTER TABLE post_hashtags
  ADD CONSTRAINT fk_post_hashtags_post_id
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

CREATE INDEX idx_post_hashtags_hashtag_id_created_at ON post_hashtags (hashtag_id, created_at);

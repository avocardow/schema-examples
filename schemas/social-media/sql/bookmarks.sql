-- bookmarks: User-saved posts for later reading.
-- See README.md for full design rationale and field documentation.

CREATE TABLE bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  post_id    UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

-- Forward FK: posts loads after bookmarks alphabetically.
ALTER TABLE bookmarks
  ADD CONSTRAINT fk_bookmarks_post_id
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

CREATE INDEX idx_bookmarks_user_id_created_at ON bookmarks (user_id, created_at);

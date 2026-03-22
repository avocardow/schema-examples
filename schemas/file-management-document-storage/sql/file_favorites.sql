-- file_favorites: Per-user file bookmarks (stars) for "starred files" UIs.
-- See README.md for full design rationale and field documentation.

CREATE TABLE file_favorites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                   -- Who favorited the file.
                                                   -- Cascade: deleting a user removes all their favorites.
  file_id         UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
                                                   -- The favorited file.
                                                   -- Cascade: deleting a file removes all its favorites.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, file_id)                        -- A user can favorite a file only once.
);

CREATE INDEX idx_file_favorites_file_id ON file_favorites (file_id);

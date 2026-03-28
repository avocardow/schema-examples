-- saved_albums: Albums a user has saved to their library.
-- See README.md for full design rationale.

CREATE TABLE saved_albums (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    album_id    UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, album_id)
);

CREATE INDEX idx_saved_albums_user_id_created_at ON saved_albums (user_id, created_at);

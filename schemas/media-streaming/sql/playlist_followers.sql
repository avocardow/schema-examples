-- playlist_followers: Users who follow a playlist for updates.
-- See README.md for full design rationale.

CREATE TABLE playlist_followers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id   UUID NOT NULL,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (playlist_id, user_id)
);

CREATE INDEX idx_playlist_followers_user_id_created_at ON playlist_followers (user_id, created_at);

-- Forward FK: playlists is defined in playlists.sql (loaded after this file).
ALTER TABLE playlist_followers ADD CONSTRAINT fk_playlist_followers_playlist_id
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE;

-- followed_artists: Artists a user follows for new release updates.
-- See README.md for full design rationale.

CREATE TABLE followed_artists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id   UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, artist_id)
);

CREATE INDEX idx_followed_artists_artist_id ON followed_artists (artist_id);

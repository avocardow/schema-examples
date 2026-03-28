-- playlists: Represents a user-curated or smart-filtered collection of podcast episodes.
-- See README.md for full design rationale.

CREATE TYPE playlist_type_enum AS ENUM ('manual', 'smart');

CREATE TABLE playlists (
    id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT              NOT NULL,
    description     TEXT,
    playlist_type   playlist_type_enum NOT NULL DEFAULT 'manual',
    smart_filters   JSONB,
    is_public       BOOLEAN           NOT NULL DEFAULT FALSE,
    episode_count   INTEGER           NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playlists_user_id_created_at
    ON playlists (user_id, created_at);

-- playlists: User-created or editorial playlists of tracks.
-- See README.md for full design rationale.

CREATE TABLE playlists (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name              TEXT NOT NULL,
    description       TEXT,
    cover_file_id     UUID REFERENCES files(id) ON DELETE SET NULL,
    is_public         BOOLEAN NOT NULL DEFAULT TRUE,
    is_collaborative  BOOLEAN NOT NULL DEFAULT FALSE,
    track_count       INTEGER NOT NULL DEFAULT 0,
    follower_count    INTEGER NOT NULL DEFAULT 0,
    total_duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playlists_owner_id_created_at ON playlists (owner_id, created_at);
CREATE INDEX idx_playlists_is_public_follower_count ON playlists (is_public, follower_count);

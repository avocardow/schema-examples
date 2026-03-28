-- tracks: Individual audio tracks available for streaming.
-- See README.md for full design rationale.

CREATE TABLE tracks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    duration_ms   INTEGER NOT NULL,
    explicit      BOOLEAN NOT NULL DEFAULT FALSE,
    isrc          TEXT,
    popularity    INTEGER NOT NULL DEFAULT 0,
    preview_url   TEXT,
    play_count    INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tracks_popularity ON tracks (popularity);
CREATE INDEX idx_tracks_play_count ON tracks (play_count);
CREATE INDEX idx_tracks_isrc ON tracks (isrc);
CREATE INDEX idx_tracks_title ON tracks (title);

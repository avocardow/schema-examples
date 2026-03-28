-- lyrics: Song lyrics with optional time-synced data for karaoke-style display.
-- See README.md for full design rationale.

CREATE TABLE lyrics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id    UUID UNIQUE NOT NULL,
    plain_text  TEXT,
    synced_text JSONB,
    language    TEXT,
    source      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lyrics_language ON lyrics (language);

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE lyrics ADD CONSTRAINT fk_lyrics_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

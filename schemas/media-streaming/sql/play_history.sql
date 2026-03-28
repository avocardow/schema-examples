-- play_history: Per-user listening history with playback context.
-- See README.md for full design rationale.

CREATE TYPE play_context_type AS ENUM (
    'album', 'playlist', 'artist', 'chart', 'search', 'queue', 'unknown'
);

CREATE TABLE play_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id        UUID NOT NULL,
    duration_ms     INTEGER NOT NULL,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    context_type    play_context_type NOT NULL DEFAULT 'unknown',
    context_id      TEXT,
    played_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_play_history_user_id_played_at ON play_history (user_id, played_at);
CREATE INDEX idx_play_history_track_id_played_at ON play_history (track_id, played_at);

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE play_history ADD CONSTRAINT fk_play_history_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

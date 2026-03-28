-- saved_tracks: Tracks a user has saved to their library.
-- See README.md for full design rationale.

CREATE TABLE saved_tracks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id    UUID NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, track_id)
);

CREATE INDEX idx_saved_tracks_user_id_created_at ON saved_tracks (user_id, created_at);

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE saved_tracks ADD CONSTRAINT fk_saved_tracks_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

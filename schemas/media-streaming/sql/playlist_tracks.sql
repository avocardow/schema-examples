-- playlist_tracks: Ordered tracks within a playlist.
-- See README.md for full design rationale.

CREATE TABLE playlist_tracks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id   UUID NOT NULL,
    track_id      UUID NOT NULL,
    added_by      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position      INTEGER NOT NULL,
    added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playlist_tracks_playlist_id_position ON playlist_tracks (playlist_id, position);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks (track_id);

-- Forward FK: playlists is defined in playlists.sql (loaded after this file).
ALTER TABLE playlist_tracks ADD CONSTRAINT fk_playlist_tracks_playlist_id
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE;

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE playlist_tracks ADD CONSTRAINT fk_playlist_tracks_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

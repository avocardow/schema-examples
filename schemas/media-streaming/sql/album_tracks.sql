-- album_tracks: Junction table positioning tracks within albums and discs.
-- See README.md for full design rationale.

CREATE TABLE album_tracks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id      UUID NOT NULL,
    track_id      UUID NOT NULL,
    disc_number   INTEGER NOT NULL DEFAULT 1,
    position      INTEGER NOT NULL,

    UNIQUE (album_id, disc_number, position)
);

CREATE INDEX idx_album_tracks_track_id ON album_tracks (track_id);

-- Forward FK: albums is defined in albums.sql (loaded after this file).
ALTER TABLE album_tracks ADD CONSTRAINT fk_album_tracks_album_id
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE;

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE album_tracks ADD CONSTRAINT fk_album_tracks_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

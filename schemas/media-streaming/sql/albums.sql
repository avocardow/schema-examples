-- albums: Collections of tracks released by an artist.
-- See README.md for full design rationale.

CREATE TYPE album_type AS ENUM ('album', 'single', 'ep', 'compilation');

CREATE TABLE albums (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             TEXT NOT NULL,
    slug              TEXT UNIQUE NOT NULL,
    artist_id         UUID NOT NULL,
    label_id          UUID,
    album_type        album_type NOT NULL DEFAULT 'album',
    cover_file_id     UUID REFERENCES files(id) ON DELETE SET NULL,
    release_date      TEXT,
    total_tracks      INTEGER NOT NULL DEFAULT 0,
    total_duration_ms INTEGER NOT NULL DEFAULT 0,
    upc               TEXT,
    copyright         TEXT,
    popularity        INTEGER NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_albums_artist_id_release_date ON albums (artist_id, release_date);
CREATE INDEX idx_albums_label_id ON albums (label_id);
CREATE INDEX idx_albums_album_type_release_date ON albums (album_type, release_date);
CREATE INDEX idx_albums_popularity ON albums (popularity);
CREATE INDEX idx_albums_release_date ON albums (release_date);

-- Forward FK: artists is defined in artists.sql (loaded after this file).
ALTER TABLE albums ADD CONSTRAINT fk_albums_artist_id
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;

-- Forward FK: labels is defined in labels.sql (loaded after this file).
ALTER TABLE albums ADD CONSTRAINT fk_albums_label_id
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE SET NULL;

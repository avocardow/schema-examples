-- artist_genres: Junction table linking artists to their genres.
-- See README.md for full design rationale.

CREATE TABLE artist_genres (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id   UUID NOT NULL,
    genre_id    UUID NOT NULL,

    UNIQUE (artist_id, genre_id)
);

CREATE INDEX idx_artist_genres_genre_id ON artist_genres (genre_id);

-- Forward FK: artists is defined in artists.sql (loaded after this file).
ALTER TABLE artist_genres ADD CONSTRAINT fk_artist_genres_artist_id
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;

-- Forward FK: genres is defined in genres.sql (loaded after this file).
ALTER TABLE artist_genres ADD CONSTRAINT fk_artist_genres_genre_id
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE;

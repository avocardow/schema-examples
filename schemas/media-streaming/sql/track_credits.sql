-- track_credits: Artist roles and contributions for each track.
-- See README.md for full design rationale.

CREATE TYPE credit_role AS ENUM (
    'primary_artist', 'featured_artist', 'writer',
    'producer', 'composer', 'mixer', 'engineer'
);

CREATE TABLE track_credits (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id    UUID NOT NULL,
    artist_id   UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    role        credit_role NOT NULL,

    UNIQUE (track_id, artist_id, role)
);

CREATE INDEX idx_track_credits_artist_id_role ON track_credits (artist_id, role);

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE track_credits ADD CONSTRAINT fk_track_credits_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

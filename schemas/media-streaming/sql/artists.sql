-- artists: Musicians and bands available on the platform.
-- See README.md for full design rationale.

CREATE TABLE artists (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    slug              TEXT UNIQUE NOT NULL,
    bio               TEXT,
    image_file_id     UUID REFERENCES files(id) ON DELETE SET NULL,
    banner_file_id    UUID REFERENCES files(id) ON DELETE SET NULL,
    is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    follower_count    INTEGER NOT NULL DEFAULT 0,
    monthly_listeners INTEGER NOT NULL DEFAULT 0,
    popularity        INTEGER NOT NULL DEFAULT 0,
    external_url      TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artists_popularity ON artists (popularity);
CREATE INDEX idx_artists_name ON artists (name);

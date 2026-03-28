-- shows: Podcast shows owned by users and optionally grouped into networks.
-- See README.md for full design rationale.

CREATE TYPE show_type_enum AS ENUM ('episodic', 'serial');
CREATE TYPE show_medium_enum AS ENUM ('podcast', 'music', 'video', 'audiobook', 'newsletter');

CREATE TABLE shows (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    network_id       UUID REFERENCES networks(id) ON DELETE SET NULL,
    title            TEXT NOT NULL,
    slug             TEXT UNIQUE NOT NULL,
    description      TEXT NOT NULL,
    html_description TEXT,
    author           TEXT NOT NULL,
    language         TEXT NOT NULL DEFAULT 'en',
    show_type        show_type_enum NOT NULL DEFAULT 'episodic',
    explicit         BOOLEAN NOT NULL DEFAULT FALSE,
    artwork_file_id  UUID REFERENCES files(id) ON DELETE SET NULL,
    banner_file_id   UUID REFERENCES files(id) ON DELETE SET NULL,
    feed_url         TEXT,
    website          TEXT,
    copyright        TEXT,
    owner_name       TEXT,
    owner_email      TEXT,
    podcast_guid     TEXT,
    medium           show_medium_enum NOT NULL DEFAULT 'podcast',
    is_complete      BOOLEAN NOT NULL DEFAULT FALSE,
    episode_count    INTEGER NOT NULL DEFAULT 0,
    subscriber_count INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shows_owner_id ON shows (owner_id);
CREATE INDEX idx_shows_network_id ON shows (network_id);
CREATE INDEX idx_shows_language_show_type ON shows (language, show_type);
CREATE INDEX idx_shows_subscriber_count ON shows (subscriber_count);

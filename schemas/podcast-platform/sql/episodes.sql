-- episodes: Represents a single podcast episode belonging to a show, including audio metadata and RSS feed fields.
-- See README.md for full design rationale.

CREATE TYPE episode_type_enum AS ENUM ('full', 'trailer', 'bonus');

CREATE TABLE episodes (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id          UUID        NOT NULL,
    title            TEXT        NOT NULL,
    slug             TEXT        NOT NULL,
    description      TEXT,
    html_description TEXT,
    episode_type     episode_type_enum NOT NULL DEFAULT 'full',
    season_number    INTEGER,
    episode_number   INTEGER,
    duration_ms      INTEGER     NOT NULL DEFAULT 0,
    explicit         BOOLEAN     NOT NULL DEFAULT FALSE,
    audio_file_id    UUID        REFERENCES files(id) ON DELETE SET NULL,
    artwork_file_id  UUID        REFERENCES files(id) ON DELETE SET NULL,
    enclosure_url    TEXT,
    enclosure_length INTEGER,
    enclosure_type   TEXT,
    guid             TEXT,
    published_at     TIMESTAMPTZ,
    is_blocked       BOOLEAN     NOT NULL DEFAULT FALSE,
    play_count       INTEGER     NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (show_id, slug)
);

ALTER TABLE episodes
    ADD CONSTRAINT fk_episodes_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_episodes_show_id_published_at ON episodes (show_id, published_at);
CREATE INDEX idx_episodes_show_id_season_episode ON episodes (show_id, season_number, episode_number);
CREATE INDEX idx_episodes_published_at ON episodes (published_at);
CREATE INDEX idx_episodes_guid ON episodes (guid);

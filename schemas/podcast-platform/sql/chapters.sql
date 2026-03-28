-- chapters: Represents a named chapter segment within a podcast episode.
-- See README.md for full design rationale.

CREATE TABLE chapters (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id      UUID        NOT NULL,
    start_time_ms   INTEGER     NOT NULL,
    end_time_ms     INTEGER,
    title           TEXT        NOT NULL,
    url             TEXT,
    image_url       TEXT,
    is_hidden       BOOLEAN     NOT NULL DEFAULT FALSE,
    position        INTEGER     NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE chapters
    ADD CONSTRAINT fk_chapters_episode_id
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE;

CREATE INDEX idx_chapters_episode_id_start_time_ms
    ON chapters (episode_id, start_time_ms);

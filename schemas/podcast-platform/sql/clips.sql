-- clips: Represents a short audio clip extracted from a podcast episode.
-- See README.md for full design rationale.

CREATE TABLE clips (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id      UUID        NOT NULL,
    created_by      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           TEXT        NOT NULL,
    start_time_ms   INTEGER     NOT NULL,
    duration_ms     INTEGER     NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE clips
    ADD CONSTRAINT fk_clips_episode_id
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE;

CREATE INDEX idx_clips_episode_id
    ON clips (episode_id);

CREATE INDEX idx_clips_created_by
    ON clips (created_by);

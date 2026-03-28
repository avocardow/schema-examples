-- listen_progress: Tracks per-user playback position and completion state for a podcast episode.
-- See README.md for full design rationale.

CREATE TABLE listen_progress (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_id  UUID        NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    position_ms INTEGER     NOT NULL DEFAULT 0,
    duration_ms INTEGER     NOT NULL DEFAULT 0,
    completed   BOOLEAN     NOT NULL DEFAULT FALSE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, episode_id)
);

CREATE INDEX idx_listen_progress_user_id_completed_updated_at
    ON listen_progress (user_id, completed, updated_at);

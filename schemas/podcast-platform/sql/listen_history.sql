-- listen_history: Records each listening session for a user on a podcast episode, tracking position and playback source.
-- See README.md for full design rationale.

CREATE TYPE listen_source_enum AS ENUM ('app', 'web', 'car', 'smart_speaker', 'watch', 'unknown');

CREATE TABLE listen_history (
    id                   UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_id           UUID             NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    started_at           TIMESTAMPTZ      NOT NULL,
    ended_at             TIMESTAMPTZ,
    position_start_ms    INTEGER          NOT NULL,
    position_end_ms      INTEGER,
    duration_listened_ms INTEGER          NOT NULL DEFAULT 0,
    source               listen_source_enum NOT NULL DEFAULT 'unknown',
    created_at           TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listen_history_user_id_started_at ON listen_history (user_id, started_at);
CREATE INDEX idx_listen_history_episode_id_started_at ON listen_history (episode_id, started_at);

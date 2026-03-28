-- episode_queue: Tracks the ordered list of episodes queued for playback by a user, with a position for sequencing.
-- See README.md for full design rationale.

CREATE TABLE episode_queue (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_id  UUID        NOT NULL,
    position    INTEGER     NOT NULL,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, episode_id)
);

ALTER TABLE episode_queue
    ADD CONSTRAINT fk_episode_queue_episode_id
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE;

CREATE INDEX idx_episode_queue_user_id_position ON episode_queue (user_id, position);

-- saved_episodes: Tracks episodes a user has explicitly saved for later listening, enforcing one save per user per episode.
-- See README.md for full design rationale.

CREATE TABLE saved_episodes (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL,
    episode_id  UUID        NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, episode_id)
);

ALTER TABLE saved_episodes
    ADD CONSTRAINT fk_saved_episodes_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_saved_episodes_user_id_created_at ON saved_episodes (user_id, created_at);

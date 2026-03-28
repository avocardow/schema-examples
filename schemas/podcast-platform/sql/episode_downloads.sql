-- episode_downloads: Tracks per-user offline download state for a podcast episode, including status lifecycle and expiry.
-- See README.md for full design rationale.

CREATE TYPE episode_download_status AS ENUM (
    'queued',
    'downloading',
    'completed',
    'failed',
    'expired'
);

CREATE TABLE episode_downloads (
    id               UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID                    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    episode_id       UUID                    NOT NULL,
    status           episode_download_status NOT NULL DEFAULT 'queued',
    device_id        TEXT,
    file_size_bytes  INTEGER,
    downloaded_at    TIMESTAMPTZ,
    expires_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, episode_id, device_id)
);

ALTER TABLE episode_downloads
    ADD CONSTRAINT fk_episode_downloads_episode_id
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE;

CREATE INDEX idx_episode_downloads_user_id_status ON episode_downloads (user_id, status);
CREATE INDEX idx_episode_downloads_expires_at ON episode_downloads (expires_at);

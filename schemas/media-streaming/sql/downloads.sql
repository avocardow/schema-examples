-- downloads: Offline download records linking users to track files.
-- See README.md for full design rationale.

CREATE TYPE download_status AS ENUM ('pending', 'downloading', 'completed', 'expired', 'failed');

CREATE TABLE downloads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id        UUID NOT NULL,
    track_file_id   UUID NOT NULL,
    status          download_status NOT NULL DEFAULT 'pending',
    expires_at      TIMESTAMPTZ,
    downloaded_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, track_file_id)
);

CREATE INDEX idx_downloads_user_id_status ON downloads (user_id, status);
CREATE INDEX idx_downloads_expires_at ON downloads (expires_at);

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE downloads ADD CONSTRAINT fk_downloads_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

-- Forward FK: track_files is defined in track_files.sql (loaded after this file).
ALTER TABLE downloads ADD CONSTRAINT fk_downloads_track_file_id
    FOREIGN KEY (track_file_id) REFERENCES track_files(id) ON DELETE CASCADE;

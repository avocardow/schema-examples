-- track_files: Audio file variants for a track at different quality levels.
-- See README.md for full design rationale.

CREATE TYPE audio_quality AS ENUM ('low', 'normal', 'high', 'lossless');

CREATE TABLE track_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id        UUID NOT NULL,
    file_id         UUID NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
    quality         audio_quality NOT NULL,
    codec           TEXT NOT NULL,
    bitrate_kbps    INTEGER,
    sample_rate_hz  INTEGER,
    file_size_bytes INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_track_files_track_id_quality ON track_files (track_id, quality);
CREATE INDEX idx_track_files_file_id ON track_files (file_id);

-- Forward FK: tracks is defined in tracks.sql (loaded after this file).
ALTER TABLE track_files ADD CONSTRAINT fk_track_files_track_id
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE;

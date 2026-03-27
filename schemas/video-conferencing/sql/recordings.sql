-- recordings: Captured audio/video recordings of meetings.
-- See README.md for full design rationale and field documentation.

CREATE TYPE recording_type AS ENUM ('composite', 'audio_only', 'video_only', 'screen_share');
CREATE TYPE recording_status AS ENUM ('recording', 'processing', 'ready', 'failed', 'deleted');

CREATE TABLE recordings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id        UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  file_id           UUID REFERENCES files (id) ON DELETE SET NULL,
  type              recording_type NOT NULL DEFAULT 'composite',
  status            recording_status NOT NULL DEFAULT 'recording',
  duration_seconds  INTEGER,
  file_size         BIGINT,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at          TIMESTAMPTZ,
  started_by        UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recordings_meeting_id ON recordings (meeting_id);
CREATE INDEX idx_recordings_status ON recordings (status);
CREATE INDEX idx_recordings_started_by ON recordings (started_by);

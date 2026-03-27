-- transcripts: Meeting transcription jobs with processing status.
-- See README.md for full design rationale and field documentation.

CREATE TYPE transcript_status AS ENUM ('processing', 'ready', 'failed');

CREATE TABLE transcripts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id    UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  language      TEXT NOT NULL DEFAULT 'en',
  status        transcript_status NOT NULL DEFAULT 'processing',
  started_by    UUID REFERENCES users (id) ON DELETE SET NULL,
  segment_count INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transcripts_meeting_id ON transcripts (meeting_id);
CREATE INDEX idx_transcripts_status ON transcripts (status);

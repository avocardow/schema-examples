-- transcript_segments: Individual spoken segments within a transcript with timing data.
-- See README.md for full design rationale and field documentation.

CREATE TABLE transcript_segments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id   UUID NOT NULL REFERENCES transcripts (id) ON DELETE CASCADE,
  speaker_id      UUID REFERENCES users (id) ON DELETE SET NULL,
  content         TEXT NOT NULL,
  speaker_name    TEXT,
  start_ms        INTEGER NOT NULL,
  end_ms          INTEGER NOT NULL,
  position        INTEGER NOT NULL,
  confidence      NUMERIC,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transcript_segments_transcript_id_position ON transcript_segments (transcript_id, position);
CREATE INDEX idx_transcript_segments_transcript_id_start_ms ON transcript_segments (transcript_id, start_ms);
CREATE INDEX idx_transcript_segments_speaker_id ON transcript_segments (speaker_id);

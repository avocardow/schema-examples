-- quality_logs: Periodic network and media quality samples per participant.
-- See README.md for full design rationale and field documentation.

CREATE TABLE quality_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id      UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  participant_id  UUID NOT NULL REFERENCES meeting_participants (id) ON DELETE CASCADE,
  bitrate_kbps    INTEGER,
  packet_loss_pct NUMERIC,
  jitter_ms       INTEGER,
  round_trip_ms   INTEGER,
  video_width     INTEGER,
  video_height    INTEGER,
  framerate       INTEGER,
  quality_score   NUMERIC,
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quality_logs_meeting_id_logged_at ON quality_logs (meeting_id, logged_at);
CREATE INDEX idx_quality_logs_participant_id_logged_at ON quality_logs (participant_id, logged_at);

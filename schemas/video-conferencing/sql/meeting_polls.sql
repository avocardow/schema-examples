-- meeting_polls: Polls launched during meetings for real-time audience feedback.
-- See README.md for full design rationale and field documentation.

CREATE TYPE poll_type AS ENUM ('single_choice', 'multiple_choice');
CREATE TYPE poll_status AS ENUM ('draft', 'active', 'closed');

CREATE TABLE meeting_polls (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  created_by  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  options     JSONB NOT NULL,
  poll_type   poll_type NOT NULL DEFAULT 'single_choice',
  status      poll_status NOT NULL DEFAULT 'draft',
  launched_at TIMESTAMPTZ,
  closed_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_polls_meeting_id_status ON meeting_polls (meeting_id, status);
CREATE INDEX idx_meeting_polls_meeting_id_created_at ON meeting_polls (meeting_id, created_at);

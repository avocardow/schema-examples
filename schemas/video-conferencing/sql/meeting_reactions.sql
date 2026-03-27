-- meeting_reactions: Ephemeral emoji reactions sent during a meeting.
-- See README.md for full design rationale and field documentation.

CREATE TABLE meeting_reactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  emoji       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_reactions_meeting_id_created_at ON meeting_reactions (meeting_id, created_at);
CREATE INDEX idx_meeting_reactions_meeting_id_emoji ON meeting_reactions (meeting_id, emoji);

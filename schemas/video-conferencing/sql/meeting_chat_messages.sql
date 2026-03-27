-- meeting_chat_messages: In-meeting chat messages, optionally directed to a specific user.
-- See README.md for full design rationale and field documentation.

CREATE TABLE meeting_chat_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id    UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  sender_id     UUID REFERENCES users (id) ON DELETE SET NULL,
  recipient_id  UUID REFERENCES users (id) ON DELETE SET NULL,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_chat_messages_meeting_id_created_at ON meeting_chat_messages (meeting_id, created_at);
CREATE INDEX idx_meeting_chat_messages_sender_id ON meeting_chat_messages (sender_id);

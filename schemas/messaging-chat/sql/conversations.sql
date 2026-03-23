-- conversations: Core container for direct messages, group chats, and channels.
-- See README.md for full design rationale and field documentation.

CREATE TYPE conversation_type AS ENUM ('direct', 'group', 'channel');

CREATE TABLE conversations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type             conversation_type NOT NULL,
  name             TEXT,
  description      TEXT,
  slug             TEXT UNIQUE,
  is_private       BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived      BOOLEAN NOT NULL DEFAULT FALSE,
  last_message_at  TIMESTAMPTZ,
  message_count    INTEGER NOT NULL DEFAULT 0,
  created_by       UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_type ON conversations (type);
CREATE INDEX idx_conversations_is_private_type ON conversations (is_private, type);
CREATE INDEX idx_conversations_created_by ON conversations (created_by);
CREATE INDEX idx_conversations_last_message_at ON conversations (last_message_at);

-- messages: Stores individual messages within conversations, supporting threads and ephemeral content.
-- See README.md for full design rationale.

CREATE TYPE message_content_type AS ENUM ('text', 'system', 'deleted');

CREATE TABLE messages (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id   UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id         UUID        REFERENCES users(id) ON DELETE SET NULL,
    content           TEXT,
    content_type      message_content_type NOT NULL DEFAULT 'text',
    parent_message_id UUID        REFERENCES messages(id) ON DELETE SET NULL,
    reply_count       INTEGER     NOT NULL DEFAULT 0,
    last_reply_at     TIMESTAMPTZ,
    is_edited         BOOLEAN     NOT NULL DEFAULT FALSE,
    edited_at         TIMESTAMPTZ,
    expires_at        TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id_created_at  ON messages (conversation_id, created_at);
CREATE INDEX idx_messages_sender_id                   ON messages (sender_id);
CREATE INDEX idx_messages_parent_message_id           ON messages (parent_message_id);
CREATE INDEX idx_messages_conversation_id_parent      ON messages (conversation_id, parent_message_id);
CREATE INDEX idx_messages_expires_at                  ON messages (expires_at);

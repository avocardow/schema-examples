-- pinned_messages: Tracks which messages have been pinned within a conversation.
-- See README.md for full design rationale.

CREATE TABLE pinned_messages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_id      UUID        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    pinned_by       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pinned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pinned_messages_conversation_id_message_id_key UNIQUE (conversation_id, message_id)
);

CREATE INDEX pinned_messages_conversation_id_pinned_at_idx
    ON pinned_messages (conversation_id, pinned_at);

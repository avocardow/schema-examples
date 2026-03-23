-- bookmarked_messages: Stores messages saved by users for later reference, with an optional personal note.
-- See README.md for full design rationale.

CREATE TABLE bookmarked_messages (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id  UUID        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_bookmarked_messages_user_message UNIQUE (user_id, message_id)
);

CREATE INDEX idx_bookmarked_messages_user_created ON bookmarked_messages (user_id, created_at);

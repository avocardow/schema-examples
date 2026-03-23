-- message_read_receipts: Tracks per-user delivery and read status for each message.
-- See README.md for full design rationale.

CREATE TABLE message_read_receipts (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id   UUID        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delivered_at TIMESTAMPTZ,
    read_at      TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_message_read_receipts_message_user UNIQUE (message_id, user_id)
);

CREATE INDEX idx_message_read_receipts_user_read_at ON message_read_receipts (user_id, read_at);

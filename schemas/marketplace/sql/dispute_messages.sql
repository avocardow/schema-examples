-- dispute_messages: Threaded messages within a dispute conversation.
-- See README.md for full design rationale.

CREATE TYPE dispute_sender_role AS ENUM ('customer', 'vendor', 'admin');

CREATE TABLE dispute_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id  UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    sender_role dispute_sender_role NOT NULL,
    body        TEXT NOT NULL,
    attachments JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dispute_messages_dispute_id_created ON dispute_messages(dispute_id, created_at);

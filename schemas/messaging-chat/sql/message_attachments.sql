-- message_attachments: Links uploaded files to chat messages as immutable attachments.
-- See README.md for full design rationale.

CREATE TABLE message_attachments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id  UUID        NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_id     UUID        NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
    file_name   TEXT        NOT NULL,
    file_size   BIGINT      NOT NULL,
    mime_type   TEXT        NOT NULL,
    position    INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_attachments_message_id ON message_attachments (message_id);
CREATE INDEX idx_message_attachments_file_id    ON message_attachments (file_id);

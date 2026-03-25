-- ticket_attachments: Files attached to ticket messages with metadata.
-- See README.md for full design rationale.

CREATE TABLE ticket_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
  message_id  UUID REFERENCES ticket_messages (id) ON DELETE SET NULL,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_size   INTEGER,
  mime_type   TEXT,
  uploaded_by UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments (ticket_id);
CREATE INDEX idx_ticket_attachments_message_id ON ticket_attachments (message_id);

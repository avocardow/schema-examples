-- ticket_messages: Individual replies and internal notes within a ticket conversation.
-- See README.md for full design rationale.

CREATE TYPE message_channel AS ENUM ('email', 'web', 'api', 'system');

CREATE TYPE message_type AS ENUM ('reply', 'note', 'customer_message', 'system');

CREATE TABLE ticket_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL,
  sender_id  UUID REFERENCES users (id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  type       message_type NOT NULL DEFAULT 'reply',
  channel    message_channel NOT NULL DEFAULT 'web',
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: tickets loads after ticket_messages alphabetically.
ALTER TABLE ticket_messages
  ADD CONSTRAINT fk_ticket_messages_ticket
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE;

CREATE INDEX idx_ticket_messages_ticket_id_created_at ON ticket_messages (ticket_id, created_at);
CREATE INDEX idx_ticket_messages_sender_id ON ticket_messages (sender_id);

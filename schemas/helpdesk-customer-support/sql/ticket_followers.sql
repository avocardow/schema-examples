-- ticket_followers: Users subscribed to receive notifications about a ticket.
-- See README.md for full design rationale.

CREATE TABLE ticket_followers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL,
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ticket_id, user_id)
);

-- Forward FK: tickets loads after ticket_followers alphabetically.
ALTER TABLE ticket_followers
  ADD CONSTRAINT fk_ticket_followers_ticket
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE;

CREATE INDEX idx_ticket_followers_user_id ON ticket_followers (user_id);

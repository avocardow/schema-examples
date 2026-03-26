-- waitlist_entries: Queue of users waiting for ticket availability on sold-out events.
-- See README.md for full design rationale.

CREATE TYPE waitlist_status AS ENUM ('waiting', 'notified', 'converted', 'expired', 'cancelled');

CREATE TABLE waitlist_entries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  ticket_type_id      UUID REFERENCES ticket_types (id) ON DELETE CASCADE,
  user_id             UUID REFERENCES users (id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  quantity            INTEGER NOT NULL DEFAULT 1,
  status              waitlist_status NOT NULL DEFAULT 'waiting',
  notified_at         TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waitlist_entries_event_ticket_status ON waitlist_entries (event_id, ticket_type_id, status);
CREATE INDEX idx_waitlist_entries_user_id ON waitlist_entries (user_id);
CREATE INDEX idx_waitlist_entries_email_status ON waitlist_entries (email, status);
CREATE INDEX idx_waitlist_entries_status_notified_at ON waitlist_entries (status, notified_at);

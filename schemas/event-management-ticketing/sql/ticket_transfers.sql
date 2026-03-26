-- ticket_transfers: Audit trail of ticket ownership transfers between holders.
-- See README.md for full design rationale.

CREATE TABLE ticket_transfers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id           UUID NOT NULL,
  from_user_id        UUID REFERENCES users (id) ON DELETE SET NULL,
  from_name           TEXT NOT NULL,
  from_email          TEXT NOT NULL,
  to_user_id          UUID REFERENCES users (id) ON DELETE SET NULL,
  to_name             TEXT NOT NULL,
  to_email            TEXT NOT NULL,
  transferred_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_transfers_ticket_id ON ticket_transfers (ticket_id);
CREATE INDEX idx_ticket_transfers_from_user_id ON ticket_transfers (from_user_id);
CREATE INDEX idx_ticket_transfers_to_user_id ON ticket_transfers (to_user_id);

-- Forward FK: tickets loads after this file alphabetically.
ALTER TABLE ticket_transfers
  ADD CONSTRAINT fk_ticket_transfers_ticket
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE;

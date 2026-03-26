-- check_ins: Records of attendee check-ins at events or individual sessions.
-- See README.md for full design rationale.

CREATE TYPE check_in_method AS ENUM ('qr_scan', 'manual', 'self_service', 'auto');

CREATE TABLE check_ins (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id           UUID NOT NULL,
  session_id          UUID REFERENCES event_sessions (id) ON DELETE SET NULL,
  checked_in_by       UUID REFERENCES users (id) ON DELETE SET NULL,
  method              check_in_method NOT NULL DEFAULT 'qr_scan',
  checked_in_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_check_ins_ticket_id ON check_ins (ticket_id);
CREATE INDEX idx_check_ins_session_id_checked_in_at ON check_ins (session_id, checked_in_at);

-- Forward FK: tickets loads after this file alphabetically.
ALTER TABLE check_ins
  ADD CONSTRAINT fk_check_ins_ticket
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE;

-- ticket_feedback: Customer satisfaction ratings and comments collected after ticket resolution.
-- See README.md for full design rationale.

CREATE TYPE feedback_rating AS ENUM ('good', 'bad');

CREATE TABLE ticket_feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id     UUID NOT NULL UNIQUE,
  rating        feedback_rating NOT NULL,
  comment       TEXT,
  created_by_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: tickets loads after ticket_feedback alphabetically.
ALTER TABLE ticket_feedback
  ADD CONSTRAINT fk_ticket_feedback_ticket
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE;

CREATE INDEX idx_ticket_feedback_rating ON ticket_feedback (rating);
CREATE INDEX idx_ticket_feedback_created_by_id ON ticket_feedback (created_by_id);

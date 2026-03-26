-- tickets: Individual admission tickets issued to holders for event entry.
-- See README.md for full design rationale.

CREATE TYPE ticket_status AS ENUM ('valid', 'used', 'cancelled', 'transferred', 'expired');

CREATE TABLE tickets (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id       UUID NOT NULL REFERENCES order_items (id) ON DELETE RESTRICT,
  event_id            UUID NOT NULL REFERENCES events (id) ON DELETE RESTRICT,
  ticket_type_id      UUID REFERENCES ticket_types (id) ON DELETE SET NULL,
  holder_user_id      UUID REFERENCES users (id) ON DELETE SET NULL,
  holder_name         TEXT NOT NULL,
  holder_email        TEXT NOT NULL,
  ticket_code         TEXT NOT NULL UNIQUE,
  status              ticket_status NOT NULL DEFAULT 'valid',
  checked_in_at       TIMESTAMPTZ,
  cancelled_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_event_id_status ON tickets (event_id, status);
CREATE INDEX idx_tickets_holder_user_id ON tickets (holder_user_id);
CREATE INDEX idx_tickets_holder_email ON tickets (holder_email);
CREATE INDEX idx_tickets_order_item_id ON tickets (order_item_id);

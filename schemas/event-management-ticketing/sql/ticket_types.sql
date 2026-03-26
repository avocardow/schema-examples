-- ticket_types: Defines pricing tiers and availability for event tickets.
-- See README.md for full design rationale.

CREATE TABLE ticket_types (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  price               INTEGER NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'USD',
  quantity_total      INTEGER,
  quantity_sold       INTEGER NOT NULL DEFAULT 0,
  min_per_order       INTEGER NOT NULL DEFAULT 1,
  max_per_order       INTEGER NOT NULL DEFAULT 10,
  sale_start_at       TIMESTAMPTZ,
  sale_end_at         TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  is_hidden           BOOLEAN NOT NULL DEFAULT FALSE,
  position            INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_types_event_id_position ON ticket_types (event_id, position);
CREATE INDEX idx_ticket_types_event_id_is_active ON ticket_types (event_id, is_active);

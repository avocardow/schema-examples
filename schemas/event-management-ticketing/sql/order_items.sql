-- order_items: Individual line items within an order, each tied to a ticket type.
-- See README.md for full design rationale.

CREATE TABLE order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  ticket_type_id      UUID,
  ticket_type_name    TEXT NOT NULL,
  unit_price          INTEGER NOT NULL,
  quantity            INTEGER NOT NULL,
  subtotal            INTEGER NOT NULL,
  currency            TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_ticket_type_id ON order_items (ticket_type_id);

-- Forward FK: ticket_types loads after this file alphabetically.
ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_ticket_type
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_types (id) ON DELETE SET NULL;

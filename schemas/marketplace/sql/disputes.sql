-- disputes: Customer-initiated disputes against vendor orders.
-- See README.md for full design rationale.

CREATE TYPE dispute_reason AS ENUM ('not_received', 'not_as_described', 'defective', 'wrong_item', 'unauthorized', 'other');
CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'escalated', 'resolved_customer', 'resolved_vendor', 'closed');

CREATE TABLE disputes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_order_id UUID NOT NULL REFERENCES vendor_orders(id) ON DELETE RESTRICT,
    customer_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    reason          dispute_reason NOT NULL,
    status          dispute_status NOT NULL DEFAULT 'open',
    description     TEXT NOT NULL,
    resolution_note TEXT,
    refund_amount   INTEGER,
    currency        TEXT NOT NULL,
    resolved_by     UUID,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_disputes_resolved_by FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_disputes_vendor_order_id ON disputes(vendor_order_id);
CREATE INDEX idx_disputes_customer_id ON disputes(customer_id);
CREATE INDEX idx_disputes_vendor_id_status ON disputes(vendor_id, status);
CREATE INDEX idx_disputes_status ON disputes(status);

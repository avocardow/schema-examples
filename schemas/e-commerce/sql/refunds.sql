-- refunds: Tracks refund requests and outcomes against payments and orders.
-- See README.md for full design rationale.

CREATE TYPE refund_status AS ENUM ('pending', 'succeeded', 'failed');

CREATE TABLE refunds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id      UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    provider_id     TEXT,
    amount          INTEGER NOT NULL,
    currency        TEXT NOT NULL,
    reason          TEXT,
    status          refund_status NOT NULL DEFAULT 'pending',
    note            TEXT,
    refunded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refunds_payment_id ON refunds (payment_id);
CREATE INDEX idx_refunds_order_id ON refunds (order_id);
CREATE INDEX idx_refunds_status ON refunds (status);

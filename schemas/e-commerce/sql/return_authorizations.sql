-- return_authorizations: Manages RMA requests for order returns, tracking approval workflow and refund outcomes.
-- See README.md for full design rationale.

CREATE TYPE return_authorization_status AS ENUM ('requested', 'approved', 'rejected', 'received', 'refunded', 'canceled');

CREATE TABLE return_authorizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    rma_number      TEXT UNIQUE NOT NULL,
    status          return_authorization_status NOT NULL DEFAULT 'requested',
    reason          TEXT,
    note            TEXT,
    refund_amount   INTEGER,
    currency        TEXT NOT NULL,
    requested_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    received_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_return_authorizations_order_id ON return_authorizations (order_id);
CREATE INDEX idx_return_authorizations_status ON return_authorizations (status);
CREATE INDEX idx_return_authorizations_created_at ON return_authorizations (created_at);

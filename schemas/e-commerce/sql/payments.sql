-- payments: Records each payment transaction against an order, including provider details and outcome.
-- See README.md for full design rationale.

CREATE TYPE payment_type AS ENUM ('authorization', 'capture', 'sale');
CREATE TYPE payment_transaction_status AS ENUM ('pending', 'succeeded', 'failed', 'canceled');

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    payment_method_id   UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    provider            TEXT NOT NULL,
    provider_id         TEXT,
    type                payment_type NOT NULL,
    status              payment_transaction_status NOT NULL DEFAULT 'pending',
    currency            TEXT NOT NULL,
    amount              INTEGER NOT NULL,
    provider_fee        INTEGER,
    metadata            JSONB,
    error_message       TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments (order_id);
CREATE INDEX idx_payments_provider_provider_id ON payments (provider, provider_id);
CREATE INDEX idx_payments_status ON payments (status);

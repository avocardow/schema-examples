-- payment_sessions: Tracks payment attempts and provider interactions for each cart.
-- See README.md for full design rationale.

CREATE TYPE payment_session_status AS ENUM ('pending', 'authorized', 'requires_action', 'completed', 'canceled', 'error');

CREATE TABLE payment_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    provider        TEXT NOT NULL,
    provider_id     TEXT,
    status          payment_session_status NOT NULL DEFAULT 'pending',
    amount          INTEGER NOT NULL,
    currency        TEXT NOT NULL,
    data            JSONB,
    is_selected     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_sessions_cart_id ON payment_sessions (cart_id);
CREATE INDEX idx_payment_sessions_provider_provider_id ON payment_sessions (provider, provider_id);
CREATE INDEX idx_payment_sessions_status ON payment_sessions (status);

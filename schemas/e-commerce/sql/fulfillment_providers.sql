-- fulfillment_providers: External and internal providers responsible for shipping and delivery of orders.
-- See README.md for full design rationale.

CREATE TYPE fulfillment_provider_type AS ENUM ('manual', 'flat_rate', 'carrier_calculated', 'third_party');

CREATE TABLE fulfillment_providers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    code            TEXT UNIQUE NOT NULL,
    type            fulfillment_provider_type NOT NULL,
    config          JSONB,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fulfillment_providers_is_active ON fulfillment_providers (is_active);

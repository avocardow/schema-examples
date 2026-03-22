-- discounts: Promotional pricing rules with usage tracking and time-bound activation.
-- See README.md for full design rationale.

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');

CREATE TABLE discounts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                TEXT,
    type                discount_type NOT NULL,
    value               NUMERIC NOT NULL,
    currency            TEXT,
    conditions          JSONB,
    usage_limit         INTEGER,
    usage_count         INTEGER NOT NULL DEFAULT 0,
    per_customer_limit  INTEGER,
    starts_at           TIMESTAMPTZ,
    ends_at             TIMESTAMPTZ,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_discounts_type ON discounts (type);
CREATE INDEX idx_discounts_is_active_starts_at_ends_at ON discounts (is_active, starts_at, ends_at);
CREATE UNIQUE INDEX idx_discounts_code ON discounts (code) WHERE code IS NOT NULL;

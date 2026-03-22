-- prices: Currency-specific pricing for product variants with quantity breaks and date ranges.
-- See README.md for full design rationale.

CREATE TABLE prices (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id        UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    currency          TEXT NOT NULL,
    amount            INTEGER NOT NULL,
    compare_at_amount INTEGER,
    min_quantity      INTEGER,
    starts_at         TIMESTAMPTZ,
    ends_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prices_variant_id_currency ON prices (variant_id, currency);
CREATE INDEX idx_prices_starts_at_ends_at ON prices (starts_at, ends_at);

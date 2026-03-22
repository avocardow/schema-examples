-- addresses: User shipping and billing addresses with default-address flags.
-- See README.md for full design rationale.

CREATE TABLE addresses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label               TEXT,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    company             TEXT,
    address_line1       TEXT NOT NULL,
    address_line2       TEXT,
    city                TEXT NOT NULL,
    region              TEXT,
    postal_code         TEXT,
    country             TEXT NOT NULL,
    phone               TEXT,
    is_default_shipping BOOLEAN NOT NULL DEFAULT FALSE,
    is_default_billing  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);

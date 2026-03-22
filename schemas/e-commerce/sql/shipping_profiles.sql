-- shipping_profiles: Configurable shipping behavior profiles for product fulfillment strategies.
-- See README.md for full design rationale.

CREATE TYPE shipping_profile_type AS ENUM ('default', 'digital', 'custom');

CREATE TABLE shipping_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    type            shipping_profile_type NOT NULL DEFAULT 'default',
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_profiles_type ON shipping_profiles (type);

-- vendor_addresses: Physical addresses for vendor business, warehouse, and returns.
-- See README.md for full design rationale.

CREATE TYPE vendor_address_type AS ENUM ('business', 'warehouse', 'return');

CREATE TABLE vendor_addresses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    type            vendor_address_type NOT NULL,
    label           TEXT,
    address_line1   TEXT NOT NULL,
    address_line2   TEXT,
    city            TEXT NOT NULL,
    region          TEXT,
    postal_code     TEXT,
    country         TEXT NOT NULL,
    phone           TEXT,
    is_default      BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_addresses_vendor_id_type ON vendor_addresses(vendor_id, type);

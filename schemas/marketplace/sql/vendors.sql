-- vendors: Marketplace seller accounts with approval and verification workflow.
-- See README.md for full design rationale.

CREATE TYPE vendor_status AS ENUM ('pending', 'active', 'suspended', 'deactivated');
CREATE TYPE vendor_verification_status AS ENUM ('unverified', 'pending_review', 'verified', 'rejected');

CREATE TABLE vendors (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name                TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    email               TEXT NOT NULL,
    phone               TEXT,
    status              vendor_status NOT NULL DEFAULT 'pending',
    verification_status vendor_verification_status NOT NULL DEFAULT 'unverified',
    commission_rate     NUMERIC,
    metadata            JSONB DEFAULT '{}',
    approved_at         TIMESTAMPTZ,
    suspended_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendors_owner_id ON vendors(owner_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_verification_status ON vendors(verification_status);

-- listings: Vendor offers on catalog products with approval workflow.
-- See README.md for full design rationale.

CREATE TYPE listing_status AS ENUM ('draft', 'pending_approval', 'active', 'paused', 'rejected', 'archived');
CREATE TYPE listing_condition AS ENUM ('new', 'refurbished', 'used_like_new', 'used_good', 'used_fair');

CREATE TABLE listings (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id        UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status           listing_status NOT NULL DEFAULT 'draft',
    condition        listing_condition NOT NULL DEFAULT 'new',
    handling_days    INTEGER NOT NULL DEFAULT 1,
    rejection_reason TEXT,
    approved_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_listings_vendor_product UNIQUE (vendor_id, product_id)
);

CREATE INDEX idx_listings_product_id_status ON listings(product_id, status);
CREATE INDEX idx_listings_status ON listings(status);

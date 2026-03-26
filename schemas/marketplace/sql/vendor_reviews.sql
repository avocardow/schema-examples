-- vendor_reviews: Customer ratings and reviews for vendor storefronts.
-- See README.md for full design rationale.

CREATE TYPE vendor_review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE vendor_reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    customer_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_order_id UUID REFERENCES vendor_orders(id) ON DELETE SET NULL,
    rating          INTEGER NOT NULL,
    title           TEXT,
    body            TEXT,
    status          vendor_review_status NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_vendor_reviews_vendor_customer_order UNIQUE (vendor_id, customer_id, vendor_order_id)
);

CREATE INDEX idx_vendor_reviews_vendor_id_status ON vendor_reviews(vendor_id, status);
CREATE INDEX idx_vendor_reviews_status ON vendor_reviews(status);

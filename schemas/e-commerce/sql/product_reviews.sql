-- product_reviews: User-submitted ratings and feedback for products, with moderation status tracking.
-- See README.md for full design rationale.

CREATE TYPE product_review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE product_reviews (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating              INTEGER NOT NULL,
    title               TEXT,
    body                TEXT,
    status              product_review_status NOT NULL DEFAULT 'pending',
    verified_purchase   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_reviews_product_id_status ON product_reviews (product_id, status);
CREATE UNIQUE INDEX idx_product_reviews_product_id_user_id ON product_reviews (product_id, user_id);
CREATE INDEX idx_product_reviews_status ON product_reviews (status);

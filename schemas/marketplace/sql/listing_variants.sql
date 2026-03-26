-- listing_variants: Vendor-specific pricing and stock for each product variant.
-- See README.md for full design rationale.

CREATE TABLE listing_variants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    variant_id      UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    price           INTEGER NOT NULL,
    currency        TEXT NOT NULL,
    sale_price      INTEGER,
    stock_quantity  INTEGER NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_listing_variants_listing_variant UNIQUE (listing_id, variant_id)
);

CREATE INDEX idx_listing_variants_variant_id_active ON listing_variants(variant_id, is_active);

-- product_variants: Purchasable SKU-level variations of a product with dimensions and ordering.
-- See README.md for full design rationale.

CREATE TABLE product_variants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    shipping_profile_id UUID,
    sku                 TEXT,
    barcode             TEXT,
    title               TEXT NOT NULL,
    option_values       JSONB,
    weight_grams        INTEGER,
    height_mm           INTEGER,
    width_mm            INTEGER,
    length_mm           INTEGER,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);
CREATE UNIQUE INDEX idx_product_variants_sku ON product_variants (sku);
CREATE INDEX idx_product_variants_barcode ON product_variants (barcode);
CREATE INDEX idx_product_variants_shipping_profile_id ON product_variants (shipping_profile_id);

-- Forward FK: shipping_profiles is defined in shipping_profiles.sql (loaded after this file).
ALTER TABLE product_variants
    ADD CONSTRAINT fk_product_variants_shipping_profile
    FOREIGN KEY (shipping_profile_id) REFERENCES shipping_profiles(id) ON DELETE SET NULL;

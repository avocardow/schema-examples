-- product_images: Images associated with products or specific variants, with sortable display order.
-- See README.md for full design rationale.

CREATE TABLE product_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    url             TEXT NOT NULL,
    alt_text        TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id_sort_order ON product_images (product_id, sort_order);
CREATE INDEX idx_product_images_variant_id ON product_images (variant_id);

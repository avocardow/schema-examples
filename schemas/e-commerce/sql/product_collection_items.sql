-- product_collection_items: Junction table linking products to curated collections with ordering.
-- See README.md for full design rationale.

CREATE TABLE product_collection_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id   UUID NOT NULL REFERENCES product_collections(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (collection_id, product_id)
);

CREATE INDEX idx_product_collection_items_product_id ON product_collection_items (product_id);

-- order_items: Individual line items within an order, capturing product details and pricing at time of purchase.
-- See README.md for full design rationale.

CREATE TABLE order_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id          UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name        TEXT NOT NULL,
    variant_title       TEXT NOT NULL,
    sku                 TEXT,
    image_url           TEXT,
    unit_price          INTEGER NOT NULL,
    quantity            INTEGER NOT NULL,
    subtotal            INTEGER NOT NULL,
    discount_total      INTEGER NOT NULL DEFAULT 0,
    tax_total           INTEGER NOT NULL DEFAULT 0,
    total               INTEGER NOT NULL,
    fulfilled_quantity  INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_variant_id ON order_items (variant_id);

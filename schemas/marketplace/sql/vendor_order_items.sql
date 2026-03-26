-- vendor_order_items: Line items within a vendor sub-order.
-- See README.md for full design rationale.

CREATE TABLE vendor_order_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_order_id     UUID NOT NULL REFERENCES vendor_orders(id) ON DELETE CASCADE,
    order_item_id       UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    listing_variant_id  UUID REFERENCES listing_variants(id) ON DELETE SET NULL,
    product_name        TEXT NOT NULL,
    variant_title       TEXT NOT NULL,
    sku                 TEXT,
    unit_price          INTEGER NOT NULL,
    quantity            INTEGER NOT NULL,
    subtotal            INTEGER NOT NULL,
    commission_amount   INTEGER NOT NULL DEFAULT 0,
    vendor_earning      INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_order_items_vendor_order_id ON vendor_order_items(vendor_order_id);
CREATE INDEX idx_vendor_order_items_order_item_id ON vendor_order_items(order_item_id);

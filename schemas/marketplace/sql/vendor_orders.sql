-- vendor_orders: Per-vendor sub-orders split from a marketplace order.
-- See README.md for full design rationale.

CREATE TYPE vendor_order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'refunded');

CREATE TABLE vendor_orders (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    vendor_id            UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    vendor_order_number  TEXT UNIQUE NOT NULL,
    status               vendor_order_status NOT NULL DEFAULT 'pending',
    currency             TEXT NOT NULL,
    subtotal             INTEGER NOT NULL,
    shipping_total       INTEGER NOT NULL DEFAULT 0,
    tax_total            INTEGER NOT NULL DEFAULT 0,
    discount_total       INTEGER NOT NULL DEFAULT 0,
    total                INTEGER NOT NULL,
    commission_amount    INTEGER NOT NULL DEFAULT 0,
    vendor_earning       INTEGER NOT NULL DEFAULT 0,
    note                 TEXT,
    shipped_at           TIMESTAMPTZ,
    delivered_at         TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_orders_order_id ON vendor_orders(order_id);
CREATE INDEX idx_vendor_orders_vendor_id_status ON vendor_orders(vendor_id, status);
CREATE INDEX idx_vendor_orders_status ON vendor_orders(status);
CREATE INDEX idx_vendor_orders_created_at ON vendor_orders(created_at);

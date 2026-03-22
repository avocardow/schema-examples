-- orders: Customer orders with status tracking, payment state, and fulfillment progress.
-- See README.md for full design rationale.

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'refunded');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partially_paid', 'paid', 'partially_refunded', 'refunded');
CREATE TYPE fulfillment_status AS ENUM ('unfulfilled', 'partially_fulfilled', 'fulfilled');

CREATE TABLE orders (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number            TEXT UNIQUE NOT NULL,
    user_id                 UUID REFERENCES users(id) ON DELETE SET NULL,
    email                   TEXT NOT NULL,
    status                  order_status NOT NULL DEFAULT 'pending',
    currency                TEXT NOT NULL,
    subtotal                INTEGER NOT NULL,
    discount_total          INTEGER NOT NULL DEFAULT 0,
    tax_total               INTEGER NOT NULL DEFAULT 0,
    shipping_total          INTEGER NOT NULL DEFAULT 0,
    grand_total             INTEGER NOT NULL,
    payment_status          payment_status NOT NULL DEFAULT 'unpaid',
    fulfillment_status      fulfillment_status NOT NULL DEFAULT 'unfulfilled',
    shipping_name           TEXT,
    shipping_address_line1  TEXT,
    shipping_address_line2  TEXT,
    shipping_city           TEXT,
    shipping_region         TEXT,
    shipping_postal_code    TEXT,
    shipping_country        TEXT,
    shipping_phone          TEXT,
    billing_name            TEXT,
    billing_address_line1   TEXT,
    billing_address_line2   TEXT,
    billing_city            TEXT,
    billing_region          TEXT,
    billing_postal_code     TEXT,
    billing_country         TEXT,
    discount_code           TEXT,
    note                    TEXT,
    canceled_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);
CREATE INDEX idx_orders_fulfillment_status ON orders (fulfillment_status);
CREATE INDEX idx_orders_created_at ON orders (created_at);

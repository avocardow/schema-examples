-- fulfillments: Shipment records linking orders to providers, with tracking and delivery status.
-- See README.md for full design rationale.

CREATE TYPE fulfillment_shipment_status AS ENUM ('pending', 'shipped', 'in_transit', 'delivered', 'failed', 'returned');

CREATE TABLE fulfillments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    provider_id         UUID REFERENCES fulfillment_providers(id) ON DELETE SET NULL,
    shipping_method_id  UUID REFERENCES shipping_methods(id) ON DELETE SET NULL,
    status              fulfillment_shipment_status NOT NULL DEFAULT 'pending',
    tracking_number     TEXT,
    tracking_url        TEXT,
    carrier             TEXT,
    shipped_at          TIMESTAMPTZ,
    delivered_at        TIMESTAMPTZ,
    note                TEXT,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fulfillments_order_id ON fulfillments (order_id);
CREATE INDEX idx_fulfillments_provider_id ON fulfillments (provider_id);
CREATE INDEX idx_fulfillments_status ON fulfillments (status);
CREATE INDEX idx_fulfillments_tracking_number ON fulfillments (tracking_number);

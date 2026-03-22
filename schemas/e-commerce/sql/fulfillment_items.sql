-- fulfillment_items: Tracks which order items (and quantities) are included in a given fulfillment.
-- See README.md for full design rationale.

CREATE TABLE fulfillment_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fulfillment_id  UUID NOT NULL REFERENCES fulfillments(id) ON DELETE CASCADE,
    order_item_id   UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    quantity        INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_fulfillment_items_fulfillment_id_order_item_id ON fulfillment_items (fulfillment_id, order_item_id);

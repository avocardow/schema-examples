-- return_items: Individual line items within a return authorization, linking back to original order items.
-- See README.md for full design rationale.

CREATE TYPE return_item_condition AS ENUM ('unopened', 'like_new', 'used', 'damaged', 'defective');

CREATE TABLE return_items (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_authorization_id   UUID NOT NULL REFERENCES return_authorizations(id) ON DELETE CASCADE,
    order_item_id             UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    quantity                  INTEGER NOT NULL,
    reason                    TEXT,
    condition                 return_item_condition,
    received_quantity         INTEGER NOT NULL DEFAULT 0,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (return_authorization_id, order_item_id)
);


-- payout_items: Individual vendor order earnings included in a payout.
-- See README.md for full design rationale.

CREATE TABLE payout_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_id       UUID NOT NULL REFERENCES payouts(id) ON DELETE CASCADE,
    vendor_order_id UUID NOT NULL REFERENCES vendor_orders(id) ON DELETE RESTRICT,
    amount          INTEGER NOT NULL,
    commission      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_payout_items_payout_vendor_order UNIQUE (payout_id, vendor_order_id)
);

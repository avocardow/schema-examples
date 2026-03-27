-- payout_items: Line items linking individual commissions to a payout batch.
-- See README.md for full design rationale.

CREATE TABLE payout_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_id       UUID NOT NULL REFERENCES payouts(id) ON DELETE CASCADE,
    commission_id   UUID NOT NULL REFERENCES commissions(id) ON DELETE RESTRICT,
    amount          INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (payout_id, commission_id)
);

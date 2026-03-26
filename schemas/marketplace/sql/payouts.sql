-- payouts: Scheduled disbursements of vendor earnings.
-- See README.md for full design rationale.

CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'canceled');

CREATE TABLE payouts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    payout_number   TEXT UNIQUE NOT NULL,
    status          payout_status NOT NULL DEFAULT 'pending',
    currency        TEXT NOT NULL,
    amount          INTEGER NOT NULL,
    fee             INTEGER NOT NULL DEFAULT 0,
    net_amount      INTEGER NOT NULL,
    provider        TEXT,
    provider_id     TEXT,
    period_start    TIMESTAMPTZ NOT NULL,
    period_end      TIMESTAMPTZ NOT NULL,
    note            TEXT,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payouts_vendor_id_status ON payouts(vendor_id, status);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_period ON payouts(period_start, period_end);

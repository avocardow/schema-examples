-- vendor_balances: Running financial summary for each vendor.
-- See README.md for full design rationale.

CREATE TABLE vendor_balances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID UNIQUE NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    currency        TEXT NOT NULL,
    available       INTEGER NOT NULL DEFAULT 0,
    pending         INTEGER NOT NULL DEFAULT 0,
    total_earned    INTEGER NOT NULL DEFAULT 0,
    total_paid_out  INTEGER NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

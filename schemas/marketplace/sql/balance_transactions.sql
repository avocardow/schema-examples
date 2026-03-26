-- balance_transactions: Ledger of all vendor balance changes for auditability.
-- See README.md for full design rationale.

CREATE TYPE balance_transaction_type AS ENUM ('earning', 'commission', 'payout', 'refund', 'adjustment', 'hold', 'release');

CREATE TABLE balance_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    type            balance_transaction_type NOT NULL,
    amount          INTEGER NOT NULL,
    currency        TEXT NOT NULL,
    running_balance INTEGER NOT NULL,
    reference_type  TEXT,
    reference_id    TEXT,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_balance_transactions_vendor_id_created ON balance_transactions(vendor_id, created_at);
CREATE INDEX idx_balance_transactions_type ON balance_transactions(type);
CREATE INDEX idx_balance_transactions_reference ON balance_transactions(reference_type, reference_id);

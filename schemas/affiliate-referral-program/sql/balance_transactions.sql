-- balance_transactions: Ledger of all balance-affecting events for affiliate accounts.
-- See README.md for full design rationale.

CREATE TYPE balance_transaction_type AS ENUM ('commission', 'payout', 'reversal', 'adjustment');

CREATE TABLE balance_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id      UUID NOT NULL REFERENCES affiliates(id) ON DELETE RESTRICT,
  type              balance_transaction_type NOT NULL,
  amount            INTEGER NOT NULL,
  currency          TEXT NOT NULL,
  running_balance   INTEGER NOT NULL,
  reference_type    TEXT,
  reference_id      TEXT,
  description       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_balance_transactions_affiliate_id_created_at ON balance_transactions (affiliate_id, created_at);
CREATE INDEX idx_balance_transactions_type ON balance_transactions (type);
CREATE INDEX idx_balance_transactions_reference ON balance_transactions (reference_type, reference_id);

-- affiliate_balances: Running balance ledger per affiliate and currency.
-- See README.md for full design rationale.

CREATE TABLE affiliate_balances (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID UNIQUE NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  currency        TEXT NOT NULL,
  available       INTEGER NOT NULL DEFAULT 0,
  pending         INTEGER NOT NULL DEFAULT 0,
  total_earned    INTEGER NOT NULL DEFAULT 0,
  total_paid_out  INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

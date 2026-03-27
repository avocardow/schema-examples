-- payouts: Scheduled and completed payments to affiliates.
-- See README.md for full design rationale.

CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'canceled');

CREATE TABLE payouts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE RESTRICT,
  payout_number   TEXT UNIQUE NOT NULL,
  status          payout_status NOT NULL DEFAULT 'pending',
  currency        TEXT NOT NULL,
  amount          INTEGER NOT NULL,
  fee             INTEGER NOT NULL DEFAULT 0,
  net_amount      INTEGER NOT NULL,
  payout_method   TEXT,
  provider_id     TEXT,
  note            TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_affiliate_id_status ON payouts (affiliate_id, status);
CREATE INDEX idx_payouts_status ON payouts (status);
CREATE INDEX idx_payouts_created_at ON payouts (created_at);

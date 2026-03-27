-- conversions: Records successful referral conversions and their monetary value.
-- See README.md for full design rationale.

CREATE TYPE conversion_status AS ENUM ('pending', 'approved', 'rejected', 'reversed');

CREATE TABLE conversions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id     UUID NOT NULL REFERENCES referrals(id) ON DELETE RESTRICT,
    affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE RESTRICT,
    external_id     TEXT,
    reference_type  TEXT,
    amount          INTEGER NOT NULL DEFAULT 0,
    currency        TEXT NOT NULL,
    status          conversion_status NOT NULL DEFAULT 'pending',
    metadata        JSONB,
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversions_referral_id ON conversions(referral_id);
CREATE INDEX idx_conversions_affiliate_id_status ON conversions(affiliate_id, status);
CREATE INDEX idx_conversions_external_id ON conversions(external_id);
CREATE INDEX idx_conversions_status ON conversions(status);
CREATE INDEX idx_conversions_created_at ON conversions(created_at);

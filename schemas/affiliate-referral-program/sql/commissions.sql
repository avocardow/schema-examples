-- commissions: Earned commissions tied to conversions, with approval and payout tracking.
-- See README.md for full design rationale.

-- Note: program_commission_type enum is already defined in programs.sql.
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'voided');

CREATE TABLE commissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversion_id   UUID NOT NULL REFERENCES conversions(id) ON DELETE RESTRICT,
    affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE RESTRICT,
    program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    amount          INTEGER NOT NULL,
    currency        TEXT NOT NULL,
    status          commission_status NOT NULL DEFAULT 'pending',
    commission_type program_commission_type NOT NULL,
    commission_rate NUMERIC,
    commission_flat INTEGER,
    tier_level      INTEGER NOT NULL DEFAULT 1,
    approved_at     TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ,
    voided_at       TIMESTAMPTZ,
    voided_reason   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_commissions_conversion_id ON commissions(conversion_id);
CREATE INDEX idx_commissions_affiliate_id_status ON commissions(affiliate_id, status);
CREATE INDEX idx_commissions_program_id_status ON commissions(program_id, status);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_created_at ON commissions(created_at);

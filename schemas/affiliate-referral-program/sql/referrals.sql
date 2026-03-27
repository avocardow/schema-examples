-- referrals: Tracks visitor referrals from affiliates through the conversion funnel.
-- See README.md for full design rationale.

CREATE TYPE referral_status AS ENUM ('visit', 'lead', 'converted', 'expired');

CREATE TABLE referrals (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id  UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    click_id      UUID REFERENCES clicks(id) ON DELETE SET NULL,
    visitor_id    TEXT,
    email         TEXT,
    status        referral_status NOT NULL DEFAULT 'visit',
    landing_url   TEXT,
    metadata      JSONB,
    converted_at  TIMESTAMPTZ,
    expires_at    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_affiliate_id_status ON referrals(affiliate_id, status);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_email ON referrals(email);
CREATE INDEX idx_referrals_visitor_id ON referrals(visitor_id);

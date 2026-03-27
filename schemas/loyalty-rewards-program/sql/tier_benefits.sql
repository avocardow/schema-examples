-- tier_benefits: Specific benefits unlocked at each tier (multipliers, perks, access).
-- See README.md for full design rationale.

CREATE TYPE benefit_type AS ENUM ('points_multiplier', 'free_shipping', 'early_access', 'birthday_bonus', 'exclusive_rewards', 'priority_support', 'custom');

CREATE TABLE tier_benefits (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id       UUID NOT NULL,
    benefit_type  benefit_type NOT NULL,
    value         TEXT,
    description   TEXT NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT true,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: tiers is defined in tiers.sql (loaded after tier_benefits.sql).
ALTER TABLE tier_benefits ADD CONSTRAINT fk_tier_benefits_tier_id
    FOREIGN KEY (tier_id) REFERENCES tiers(id) ON DELETE CASCADE;

CREATE INDEX idx_tier_benefits_tier_id ON tier_benefits(tier_id);
CREATE INDEX idx_tier_benefits_benefit_type ON tier_benefits(benefit_type);

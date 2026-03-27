-- member_tiers: Assignment of members to tiers with temporal tracking and history.
-- See README.md for full design rationale.

CREATE TABLE member_tiers (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id              UUID NOT NULL REFERENCES loyalty_members(id) ON DELETE CASCADE,
    tier_id                UUID NOT NULL,
    is_current             BOOLEAN NOT NULL DEFAULT true,
    started_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at                TIMESTAMPTZ,
    ended_at               TIMESTAMPTZ,
    qualification_snapshot JSONB,
    is_manual              BOOLEAN NOT NULL DEFAULT false,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: tiers is defined in tiers.sql (loaded after member_tiers.sql).
ALTER TABLE member_tiers ADD CONSTRAINT fk_member_tiers_tier_id
    FOREIGN KEY (tier_id) REFERENCES tiers(id) ON DELETE CASCADE;

CREATE INDEX idx_member_tiers_member_id_is_current ON member_tiers(member_id, is_current);
CREATE INDEX idx_member_tiers_tier_id ON member_tiers(tier_id);
CREATE INDEX idx_member_tiers_ends_at ON member_tiers(ends_at);

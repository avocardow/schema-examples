-- tiers: Tier/VIP level definitions with qualification thresholds and ordering.
-- See README.md for full design rationale.

CREATE TYPE tier_qualification_type AS ENUM ('points_earned', 'amount_spent', 'transaction_count');

CREATE TABLE tiers (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id                UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    name                      TEXT NOT NULL,
    slug                      TEXT NOT NULL,
    description               TEXT,
    position                  INTEGER NOT NULL,
    qualification_type        tier_qualification_type NOT NULL DEFAULT 'points_earned',
    qualification_value       INTEGER NOT NULL,
    qualification_period_days INTEGER,
    retain_days               INTEGER,
    icon_url                  TEXT,
    color                     TEXT,
    is_default                BOOLEAN NOT NULL DEFAULT false,
    metadata                  JSONB,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(program_id, slug),
    UNIQUE(program_id, position)
);

CREATE INDEX idx_tiers_is_default ON tiers(is_default);

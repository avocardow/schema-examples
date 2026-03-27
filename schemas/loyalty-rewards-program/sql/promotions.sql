-- promotions: Time-limited bonus earning campaigns (multipliers, fixed bonuses).
-- See README.md for full design rationale.

CREATE TYPE promotion_type AS ENUM ('multiplier', 'fixed_bonus');
CREATE TYPE promotion_status AS ENUM ('scheduled', 'active', 'ended', 'canceled');

CREATE TABLE promotions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id            UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    name                  TEXT NOT NULL,
    description           TEXT,
    promotion_type        promotion_type NOT NULL DEFAULT 'multiplier',
    multiplier            NUMERIC,
    bonus_points          INTEGER,
    event_type            TEXT,
    conditions            JSONB,
    status                promotion_status NOT NULL DEFAULT 'scheduled',
    starts_at             TIMESTAMPTZ NOT NULL,
    ends_at               TIMESTAMPTZ NOT NULL,
    max_points_per_member INTEGER,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_program_id_status ON promotions(program_id, status);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotions_starts_at_ends_at ON promotions(starts_at, ends_at);

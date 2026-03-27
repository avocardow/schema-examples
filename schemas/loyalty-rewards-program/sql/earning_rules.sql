-- earning_rules: Rules defining how members earn points (event type, amount, conditions).
-- See README.md for full design rationale.

CREATE TYPE earning_type AS ENUM ('fixed', 'per_currency', 'multiplier');

CREATE TABLE earning_rules (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id          UUID NOT NULL,
    name                TEXT NOT NULL,
    description         TEXT,
    event_type          TEXT NOT NULL,
    earning_type        earning_type NOT NULL DEFAULT 'fixed',
    points_amount       INTEGER,
    multiplier          NUMERIC,
    min_purchase_amount INTEGER,
    max_points_per_event INTEGER,
    conditions          JSONB,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: loyalty_programs is defined in loyalty_programs.sql (loaded after earning_rules.sql).
ALTER TABLE earning_rules ADD CONSTRAINT fk_earning_rules_program_id
    FOREIGN KEY (program_id) REFERENCES loyalty_programs(id) ON DELETE CASCADE;

CREATE INDEX idx_earning_rules_program_id_is_active ON earning_rules(program_id, is_active);
CREATE INDEX idx_earning_rules_event_type ON earning_rules(event_type);

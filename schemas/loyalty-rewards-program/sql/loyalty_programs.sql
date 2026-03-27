-- loyalty_programs: Top-level loyalty program configuration with currency, earning, and expiration settings.
-- See README.md for full design rationale.

CREATE TYPE loyalty_program_status AS ENUM ('draft', 'active', 'paused', 'archived');

CREATE TABLE loyalty_programs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    description         TEXT,
    status              loyalty_program_status NOT NULL DEFAULT 'draft',
    currency_name       TEXT NOT NULL DEFAULT 'points',
    points_per_currency NUMERIC NOT NULL DEFAULT 1,
    currency            TEXT,
    points_expiry_days  INTEGER,
    allow_negative      BOOLEAN NOT NULL DEFAULT false,
    is_public           BOOLEAN NOT NULL DEFAULT true,
    terms_url           TEXT,
    metadata            JSONB DEFAULT '{}',
    created_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loyalty_programs_status ON loyalty_programs(status);
CREATE INDEX idx_loyalty_programs_created_by ON loyalty_programs(created_by);

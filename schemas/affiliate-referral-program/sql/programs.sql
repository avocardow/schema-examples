-- programs: Affiliate/referral programs with commission settings and attribution rules.
-- See README.md for full design rationale.

CREATE TYPE program_status AS ENUM ('draft', 'active', 'paused', 'archived');
CREATE TYPE program_commission_type AS ENUM ('percentage', 'flat', 'hybrid');
CREATE TYPE program_attribution_model AS ENUM ('first_touch', 'last_touch');

CREATE TABLE programs (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                  TEXT NOT NULL,
    slug                  TEXT UNIQUE NOT NULL,
    description           TEXT,
    status                program_status NOT NULL DEFAULT 'draft',
    commission_type       program_commission_type NOT NULL DEFAULT 'percentage',
    commission_percentage NUMERIC,
    commission_flat       INTEGER,
    currency              TEXT NOT NULL,
    cookie_duration       INTEGER NOT NULL DEFAULT 30,
    attribution_model     program_attribution_model NOT NULL DEFAULT 'last_touch',
    min_payout            INTEGER NOT NULL DEFAULT 0,
    auto_approve          BOOLEAN NOT NULL DEFAULT false,
    is_public             BOOLEAN NOT NULL DEFAULT true,
    terms_url             TEXT,
    created_by            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_created_by ON programs(created_by);

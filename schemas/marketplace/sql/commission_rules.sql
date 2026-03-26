-- commission_rules: Configurable commission rates by scope (global, vendor, category).
-- See README.md for full design rationale.

CREATE TYPE commission_scope AS ENUM ('global', 'vendor', 'category');
CREATE TYPE commission_rate_type AS ENUM ('percentage', 'flat', 'hybrid');

CREATE TABLE commission_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    scope           commission_scope NOT NULL,
    vendor_id       UUID REFERENCES vendors(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES categories(id) ON DELETE CASCADE,
    rate_type       commission_rate_type NOT NULL DEFAULT 'percentage',
    percentage_rate NUMERIC,
    flat_rate       INTEGER,
    currency        TEXT,
    min_commission  INTEGER,
    max_commission  INTEGER,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    priority        INTEGER NOT NULL DEFAULT 0,
    effective_from  TIMESTAMPTZ,
    effective_to    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_commission_rules_scope_active ON commission_rules(scope, is_active);
CREATE INDEX idx_commission_rules_vendor_id ON commission_rules(vendor_id);
CREATE INDEX idx_commission_rules_category_id ON commission_rules(category_id);

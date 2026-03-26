-- benefit_plans: Available employee benefit plans with contribution details and plan periods.
-- See README.md for full design rationale.

CREATE TYPE benefit_plan_type AS ENUM (
  'health', 'dental', 'vision', 'retirement_401k',
  'life_insurance', 'disability', 'hsa', 'fsa', 'other'
);

CREATE TABLE benefit_plans (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  type                   benefit_plan_type NOT NULL,
  description            TEXT,
  employer_contribution  INTEGER,
  employee_contribution  INTEGER,
  currency               TEXT NOT NULL DEFAULT 'USD',
  is_active              BOOLEAN NOT NULL DEFAULT TRUE,
  plan_year_start        TEXT,
  plan_year_end          TEXT,
  metadata               JSONB,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_benefit_plans_type ON benefit_plans (type);
CREATE INDEX idx_benefit_plans_is_active ON benefit_plans (is_active);

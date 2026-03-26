-- leave_policies: Configurable rules governing each type of employee leave, including accrual and carryover limits.
-- See README.md for full design rationale.

CREATE TYPE leave_type AS ENUM (
  'vacation',
  'sick',
  'personal',
  'parental',
  'bereavement',
  'jury_duty',
  'unpaid',
  'other'
);

CREATE TYPE accrual_frequency AS ENUM (
  'per_pay_period',
  'monthly',
  'quarterly',
  'annually',
  'none'
);

CREATE TABLE leave_policies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  type                leave_type NOT NULL,
  accrual_rate        NUMERIC,
  accrual_frequency   accrual_frequency NOT NULL DEFAULT 'none',
  max_balance         NUMERIC,
  max_carryover       NUMERIC,
  is_paid             BOOLEAN NOT NULL DEFAULT TRUE,
  requires_approval   BOOLEAN NOT NULL DEFAULT TRUE,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leave_policies_type ON leave_policies (type);
CREATE INDEX idx_leave_policies_is_active ON leave_policies (is_active);

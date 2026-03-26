-- compensation: Employee pay rates, frequencies, and historical compensation changes.
-- See README.md for full design rationale.

CREATE TYPE pay_type AS ENUM ('salary', 'hourly');

CREATE TYPE pay_frequency AS ENUM (
  'weekly',
  'biweekly',
  'semimonthly',
  'monthly',
  'annually'
);

CREATE TABLE compensation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  pay_type        pay_type NOT NULL,
  amount          INTEGER NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'USD',
  pay_frequency   pay_frequency NOT NULL,
  effective_date  TEXT NOT NULL,
  end_date        TEXT,
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compensation_employee_id ON compensation (employee_id);
CREATE INDEX idx_compensation_effective_date ON compensation (effective_date);

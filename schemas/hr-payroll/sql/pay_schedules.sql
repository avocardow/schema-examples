-- pay_schedules: Recurring payroll cadences that determine when employees are paid.
-- See README.md for full design rationale.

CREATE TYPE pay_schedule_frequency AS ENUM (
  'weekly',
  'biweekly',
  'semimonthly',
  'monthly'
);

CREATE TABLE pay_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  frequency       pay_schedule_frequency NOT NULL,
  anchor_date     TEXT NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pay_schedules_frequency ON pay_schedules (frequency);
CREATE INDEX idx_pay_schedules_is_active ON pay_schedules (is_active);

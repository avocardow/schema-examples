-- payroll_runs: Batch payroll executions linking a pay schedule to a specific pay period and date.
-- See README.md for full design rationale.

CREATE TYPE payroll_run_status AS ENUM ('draft', 'processing', 'completed', 'failed', 'voided');

CREATE TABLE payroll_runs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pay_schedule_id     UUID NOT NULL REFERENCES pay_schedules(id) ON DELETE RESTRICT,
  period_start        TEXT NOT NULL,
  period_end          TEXT NOT NULL,
  pay_date            TEXT NOT NULL,
  status              payroll_run_status NOT NULL DEFAULT 'draft',
  total_gross         INTEGER NOT NULL DEFAULT 0,
  total_deductions    INTEGER NOT NULL DEFAULT 0,
  total_net           INTEGER NOT NULL DEFAULT 0,
  employee_count      INTEGER NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'USD',
  processed_at        TIMESTAMPTZ,
  processed_by        UUID REFERENCES users (id) ON DELETE SET NULL,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payroll_runs_pay_schedule_id ON payroll_runs (pay_schedule_id);
CREATE INDEX idx_payroll_runs_status ON payroll_runs (status);
CREATE INDEX idx_payroll_runs_pay_date ON payroll_runs (pay_date);

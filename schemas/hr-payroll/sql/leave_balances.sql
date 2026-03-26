-- leave_balances: Per-employee annual leave entitlement, accrual, usage, and carry-over totals.
-- See README.md for full design rationale.

CREATE TABLE leave_balances (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id      UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  leave_policy_id  UUID NOT NULL,
  balance          NUMERIC NOT NULL DEFAULT 0,
  accrued          NUMERIC NOT NULL DEFAULT 0,
  used             NUMERIC NOT NULL DEFAULT 0,
  carried_over     NUMERIC NOT NULL DEFAULT 0,
  year             INTEGER NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (employee_id, leave_policy_id, year)
);

CREATE INDEX idx_leave_balances_leave_policy_id ON leave_balances (leave_policy_id);

-- Forward FK: leave_policies loads after leave_balances alphabetically.
ALTER TABLE leave_balances
  ADD CONSTRAINT fk_leave_balances_leave_policy
  FOREIGN KEY (leave_policy_id) REFERENCES leave_policies (id) ON DELETE CASCADE;

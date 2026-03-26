-- pay_stubs: Individual pay stub issued to an employee for a payroll run.
-- See README.md for full design rationale.

CREATE TABLE pay_stubs (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id   UUID        NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id      UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    gross_pay        INTEGER     NOT NULL DEFAULT 0,
    total_deductions INTEGER     NOT NULL DEFAULT 0,
    net_pay          INTEGER     NOT NULL DEFAULT 0,
    currency         TEXT        NOT NULL DEFAULT 'USD',
    pay_date         TEXT        NOT NULL,
    period_start     TEXT        NOT NULL,
    period_end       TEXT        NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (payroll_run_id, employee_id)
);

CREATE INDEX idx_pay_stubs_employee_id ON pay_stubs (employee_id);
CREATE INDEX idx_pay_stubs_pay_date    ON pay_stubs (pay_date);

-- leave_requests: Employee time-off requests with approval workflow and policy tracking.
-- See README.md for full design rationale.

CREATE TYPE leave_request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

CREATE TABLE leave_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id       UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  leave_policy_id   UUID NOT NULL REFERENCES leave_policies(id) ON DELETE RESTRICT,
  start_date        TEXT NOT NULL,
  end_date          TEXT NOT NULL,
  days_requested    NUMERIC NOT NULL,
  status            leave_request_status NOT NULL DEFAULT 'pending',
  reason            TEXT,
  reviewer_id       UUID REFERENCES users (id) ON DELETE SET NULL,
  reviewed_at       TIMESTAMPTZ,
  reviewer_note     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_employee_id ON leave_requests (employee_id);
CREATE INDEX idx_leave_requests_leave_policy_id ON leave_requests (leave_policy_id);
CREATE INDEX idx_leave_requests_status ON leave_requests (status);
CREATE INDEX idx_leave_requests_start_date ON leave_requests (start_date);

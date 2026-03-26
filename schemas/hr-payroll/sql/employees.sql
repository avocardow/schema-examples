-- employees: Company workforce members with employment details and status tracking.
-- See README.md for full design rationale.

CREATE TYPE employment_type AS ENUM (
  'full_time',
  'part_time',
  'contractor',
  'intern',
  'temporary'
);

CREATE TYPE employee_status AS ENUM (
  'active',
  'on_leave',
  'suspended',
  'terminated'
);

CREATE TABLE employees (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users (id) ON DELETE SET NULL,
  employee_number   TEXT,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  date_of_birth     TEXT,
  hire_date         TEXT NOT NULL,
  termination_date  TEXT,
  employment_type   employment_type NOT NULL,
  status            employee_status NOT NULL DEFAULT 'active',
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_employees_employee_number ON employees (employee_number);
CREATE INDEX idx_employees_user_id ON employees (user_id);
CREATE INDEX idx_employees_status ON employees (status);
CREATE INDEX idx_employees_employment_type ON employees (employment_type);

-- employee_jobs: Job assignments linking employees to positions, departments, and managers.
-- See README.md for full design rationale.

-- Uses employment_type enum from employees.sql.

CREATE TABLE employee_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id       UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  position_id       UUID REFERENCES positions (id) ON DELETE SET NULL,
  department_id     UUID NOT NULL REFERENCES departments (id) ON DELETE RESTRICT,
  manager_id        UUID REFERENCES employees (id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  employment_type   employment_type NOT NULL,
  effective_date    TEXT NOT NULL,
  end_date          TEXT,
  reason            TEXT,
  is_primary        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employee_jobs_employee_id ON employee_jobs (employee_id);
CREATE INDEX idx_employee_jobs_position_id ON employee_jobs (position_id);
CREATE INDEX idx_employee_jobs_department_id ON employee_jobs (department_id);
CREATE INDEX idx_employee_jobs_manager_id ON employee_jobs (manager_id);
CREATE INDEX idx_employee_jobs_effective_date ON employee_jobs (effective_date);

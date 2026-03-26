-- benefit_enrollments: Employee enrollment in benefit plans with coverage level and contribution amounts.
-- See README.md for full design rationale.

CREATE TYPE coverage_level AS ENUM (
  'employee_only',
  'employee_spouse',
  'employee_children',
  'family'
);

CREATE TYPE benefit_enrollment_status AS ENUM (
  'active',
  'pending',
  'terminated',
  'waived'
);

CREATE TABLE benefit_enrollments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id           UUID NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  benefit_plan_id       UUID NOT NULL REFERENCES benefit_plans (id) ON DELETE RESTRICT,
  coverage_level        coverage_level NOT NULL DEFAULT 'employee_only',
  employee_contribution INTEGER NOT NULL DEFAULT 0,
  employer_contribution INTEGER NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'USD',
  effective_date        TEXT NOT NULL,
  end_date              TEXT,
  status                benefit_enrollment_status NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_benefit_enrollments_employee_id ON benefit_enrollments (employee_id);
CREATE INDEX idx_benefit_enrollments_benefit_plan_id ON benefit_enrollments (benefit_plan_id);
CREATE INDEX idx_benefit_enrollments_status ON benefit_enrollments (status);
CREATE INDEX idx_benefit_enrollments_effective_date ON benefit_enrollments (effective_date);

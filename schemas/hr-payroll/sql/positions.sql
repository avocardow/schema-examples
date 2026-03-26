-- positions: Job positions within departments, with level and pay-grade metadata.
-- See README.md for full design rationale.

CREATE TABLE positions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id     UUID REFERENCES departments (id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  code              TEXT,
  description       TEXT,
  level             INTEGER,
  pay_grade         TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_positions_department_id ON positions (department_id);
CREATE INDEX idx_positions_is_active ON positions (is_active);

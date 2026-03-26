-- control_tests: Records of periodic control testing and their results.
-- See README.md for full design rationale.

CREATE TYPE control_test_result AS ENUM ('pass', 'fail', 'partial', 'not_applicable');

CREATE TABLE control_tests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id     UUID NOT NULL REFERENCES controls (id) ON DELETE CASCADE,
  tested_by      UUID REFERENCES users (id) ON DELETE SET NULL,
  test_date      TIMESTAMPTZ NOT NULL,
  result         control_test_result NOT NULL,
  notes          TEXT,
  next_test_date TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_control_tests_control_id ON control_tests (control_id);
CREATE INDEX idx_control_tests_tested_by ON control_tests (tested_by);
CREATE INDEX idx_control_tests_result ON control_tests (result);
CREATE INDEX idx_control_tests_test_date ON control_tests (test_date);

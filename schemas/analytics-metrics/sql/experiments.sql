-- experiments: A/B test experiments with hypothesis, traffic allocation, and lifecycle status.
-- See README.md for full design rationale.

CREATE TYPE experiment_status AS ENUM ('draft', 'running', 'paused', 'completed');

CREATE TABLE experiments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  description         TEXT,
  hypothesis          TEXT,
  status              experiment_status NOT NULL DEFAULT 'draft',
  traffic_percentage  NUMERIC NOT NULL DEFAULT 1.0,
  started_at          TIMESTAMPTZ,
  ended_at            TIMESTAMPTZ,
  created_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experiments_status ON experiments (status);
CREATE INDEX idx_experiments_created_by ON experiments (created_by);

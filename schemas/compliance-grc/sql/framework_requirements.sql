-- framework_requirements: Individual requirements within a compliance framework.
-- See README.md for full design rationale.

CREATE TABLE framework_requirements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id  UUID NOT NULL REFERENCES frameworks (id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES framework_requirements (id) ON DELETE CASCADE,
  identifier    TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_framework_requirements_framework_identifier ON framework_requirements (framework_id, identifier);
CREATE INDEX idx_framework_requirements_parent_id ON framework_requirements (parent_id);
CREATE INDEX idx_framework_requirements_sort_order ON framework_requirements (sort_order);

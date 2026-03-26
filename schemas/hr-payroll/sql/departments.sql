-- departments: Organizational units within a company hierarchy.
-- See README.md for full design rationale.

CREATE TABLE departments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID REFERENCES organizations (id) ON DELETE CASCADE,
  parent_id         UUID REFERENCES departments (id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  code              TEXT,
  description       TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_departments_organization_id ON departments (organization_id);
CREATE INDEX idx_departments_parent_id ON departments (parent_id);
CREATE INDEX idx_departments_is_active ON departments (is_active);

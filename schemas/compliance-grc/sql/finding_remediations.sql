-- finding_remediations: Action items to address audit findings.
-- See README.md for full design rationale.

CREATE TYPE remediation_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE remediation_priority AS ENUM ('critical', 'high', 'medium', 'low');

CREATE TABLE finding_remediations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id   UUID NOT NULL REFERENCES audit_findings (id) ON DELETE CASCADE,
  assigned_to  UUID REFERENCES users (id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  status       remediation_status NOT NULL DEFAULT 'pending',
  priority     remediation_priority NOT NULL DEFAULT 'medium',
  due_date     TEXT,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_finding_remediations_finding_id ON finding_remediations (finding_id);
CREATE INDEX idx_finding_remediations_assigned_to ON finding_remediations (assigned_to);
CREATE INDEX idx_finding_remediations_status ON finding_remediations (status);
CREATE INDEX idx_finding_remediations_priority ON finding_remediations (priority);
CREATE INDEX idx_finding_remediations_due_date ON finding_remediations (due_date);

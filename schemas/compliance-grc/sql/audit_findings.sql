-- audit_findings: Issues discovered during audits, linked to controls and risks.
-- See README.md for full design rationale.

CREATE TYPE finding_severity AS ENUM ('critical', 'high', 'medium', 'low', 'informational');
CREATE TYPE finding_status AS ENUM ('open', 'in_progress', 'remediated', 'accepted', 'closed');

CREATE TABLE audit_findings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id    UUID NOT NULL REFERENCES audits (id) ON DELETE CASCADE,
  control_id  UUID,
  risk_id     UUID,
  title       TEXT NOT NULL,
  description TEXT,
  severity    finding_severity NOT NULL,
  status      finding_status NOT NULL DEFAULT 'open',
  due_date    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FKs: controls and risks load after audit_findings alphabetically.
ALTER TABLE audit_findings
  ADD CONSTRAINT fk_audit_findings_control
  FOREIGN KEY (control_id) REFERENCES controls (id) ON DELETE SET NULL;

ALTER TABLE audit_findings
  ADD CONSTRAINT fk_audit_findings_risk
  FOREIGN KEY (risk_id) REFERENCES risks (id) ON DELETE SET NULL;

CREATE INDEX idx_audit_findings_audit_id ON audit_findings (audit_id);
CREATE INDEX idx_audit_findings_control_id ON audit_findings (control_id);
CREATE INDEX idx_audit_findings_risk_id ON audit_findings (risk_id);
CREATE INDEX idx_audit_findings_severity ON audit_findings (severity);
CREATE INDEX idx_audit_findings_status ON audit_findings (status);

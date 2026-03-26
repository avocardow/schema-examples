-- evidence: Artifacts collected to demonstrate control effectiveness.
-- See README.md for full design rationale.

CREATE TYPE evidence_type AS ENUM ('document', 'screenshot', 'log_export', 'automated_test', 'manual_review', 'certification');

CREATE TABLE evidence (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id    UUID NOT NULL REFERENCES controls (id) ON DELETE CASCADE,
  audit_id      UUID REFERENCES audits (id) ON DELETE SET NULL,
  file_id       UUID REFERENCES files (id) ON DELETE SET NULL,
  collected_by  UUID REFERENCES users (id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  evidence_type evidence_type NOT NULL,
  description   TEXT,
  collected_at  TIMESTAMPTZ NOT NULL,
  valid_from    TEXT,
  valid_until   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_control_id ON evidence (control_id);
CREATE INDEX idx_evidence_audit_id ON evidence (audit_id);
CREATE INDEX idx_evidence_collected_by ON evidence (collected_by);
CREATE INDEX idx_evidence_evidence_type ON evidence (evidence_type);
CREATE INDEX idx_evidence_collected_at ON evidence (collected_at);

-- audits: Internal and external audit engagements.
-- See README.md for full design rationale.

CREATE TYPE audit_type AS ENUM ('internal', 'external', 'self_assessment', 'certification');
CREATE TYPE audit_status AS ENUM ('planned', 'in_progress', 'review', 'completed', 'cancelled');

CREATE TABLE audits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations (id) ON DELETE CASCADE,
  lead_auditor_id UUID REFERENCES users (id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  audit_type      audit_type NOT NULL,
  status          audit_status NOT NULL DEFAULT 'planned',
  scope           TEXT,
  start_date      TEXT,
  end_date        TEXT,
  conclusion      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audits_organization_id ON audits (organization_id);
CREATE INDEX idx_audits_lead_auditor_id ON audits (lead_auditor_id);
CREATE INDEX idx_audits_audit_type ON audits (audit_type);
CREATE INDEX idx_audits_status ON audits (status);

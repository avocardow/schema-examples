-- risks: Identified risks tracked through assessment and treatment lifecycle.
-- See README.md for full design rationale.

CREATE TYPE risk_category AS ENUM ('strategic', 'operational', 'financial', 'compliance', 'reputational', 'technical', 'third_party');
CREATE TYPE risk_level AS ENUM ('critical', 'high', 'medium', 'low', 'very_low');
CREATE TYPE risk_treatment AS ENUM ('mitigate', 'accept', 'transfer', 'avoid');
CREATE TYPE risk_status AS ENUM ('identified', 'assessing', 'treating', 'monitoring', 'closed');

CREATE TABLE risks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations (id) ON DELETE CASCADE,
  owner_id        UUID REFERENCES users (id) ON DELETE SET NULL,
  identifier      TEXT UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  category        risk_category NOT NULL,
  likelihood      INTEGER NOT NULL DEFAULT 3,
  impact          INTEGER NOT NULL DEFAULT 3,
  risk_level      risk_level NOT NULL DEFAULT 'medium',
  treatment       risk_treatment NOT NULL DEFAULT 'mitigate',
  status          risk_status NOT NULL DEFAULT 'identified',
  due_date        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risks_organization_id ON risks (organization_id);
CREATE INDEX idx_risks_owner_id ON risks (owner_id);
CREATE INDEX idx_risks_category ON risks (category);
CREATE INDEX idx_risks_risk_level ON risks (risk_level);
CREATE INDEX idx_risks_status ON risks (status);

-- controls: Security and compliance controls implemented by the organization.
-- See README.md for full design rationale.

CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective', 'directive');
CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
CREATE TYPE control_frequency AS ENUM ('continuous', 'daily', 'weekly', 'monthly', 'quarterly', 'annually', 'as_needed');
CREATE TYPE control_status AS ENUM ('draft', 'active', 'inactive', 'deprecated');
CREATE TYPE control_effectiveness AS ENUM ('effective', 'partially_effective', 'ineffective', 'not_assessed');

CREATE TABLE controls (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      UUID REFERENCES organizations (id) ON DELETE CASCADE,
  owner_id             UUID REFERENCES users (id) ON DELETE SET NULL,
  identifier           TEXT UNIQUE,
  title                TEXT NOT NULL,
  description          TEXT,
  control_type         control_type NOT NULL,
  category             control_category NOT NULL,
  frequency            control_frequency NOT NULL DEFAULT 'continuous',
  status               control_status NOT NULL DEFAULT 'draft',
  effectiveness        control_effectiveness NOT NULL DEFAULT 'not_assessed',
  implementation_notes TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_controls_organization_id ON controls (organization_id);
CREATE INDEX idx_controls_owner_id ON controls (owner_id);
CREATE INDEX idx_controls_status ON controls (status);
CREATE INDEX idx_controls_control_type ON controls (control_type);
CREATE INDEX idx_controls_category ON controls (category);

-- compliance_activities: Immutable activity log for compliance-related events.
-- See README.md for full design rationale.

CREATE TYPE compliance_activity_type AS ENUM (
  'control_created', 'control_updated', 'control_tested',
  'risk_created', 'risk_updated', 'risk_closed',
  'policy_created', 'policy_approved', 'policy_acknowledged',
  'audit_started', 'audit_completed',
  'finding_created', 'finding_remediated', 'finding_closed',
  'evidence_collected'
);

CREATE TYPE compliance_entity_type AS ENUM (
  'control', 'risk', 'policy', 'policy_version',
  'audit', 'audit_finding', 'finding_remediation', 'evidence'
);

CREATE TABLE compliance_activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations (id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES users (id) ON DELETE SET NULL,
  activity_type   compliance_activity_type NOT NULL,
  entity_type     compliance_entity_type NOT NULL,
  entity_id       UUID NOT NULL,
  summary         TEXT NOT NULL,
  details         JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_activities_organization_id ON compliance_activities (organization_id);
CREATE INDEX idx_compliance_activities_actor_id ON compliance_activities (actor_id);
CREATE INDEX idx_compliance_activities_activity_type ON compliance_activities (activity_type);
CREATE INDEX idx_compliance_activities_entity_type ON compliance_activities (entity_type);
CREATE INDEX idx_compliance_activities_entity_id ON compliance_activities (entity_id);
CREATE INDEX idx_compliance_activities_created_at ON compliance_activities (created_at);

-- audit_logs: Immutable event log for security-relevant actions.
-- Append-only — never update or delete rows.
-- Uses polymorphic actor/target (not FKs) so logs survive entity deletion.
-- See README.md for full design rationale and field documentation.

CREATE TYPE audit_actor_type AS ENUM ('user', 'system', 'api_key', 'service');

CREATE TABLE audit_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Structured event codes: resource.action.result
  -- e.g., "user.login.success", "role.assigned", "session.impersonation.started"
  event_type        TEXT NOT NULL,

  -- Polymorphic actor/target: NOT FKs. Audit logs must survive entity deletion.
  actor_type        audit_actor_type NOT NULL,
  actor_id          TEXT,                           -- user_id, api_key_id, or service name.
  target_type       TEXT,                           -- e.g., "user", "organization", "role".
  target_id         TEXT,

  organization_id   UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Survives org deletion.
  ip_address        TEXT,
  user_agent        TEXT,
  metadata          JSONB,                          -- Event-specific details (e.g., {"old_role": "member", "new_role": "admin"}).
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_event_type ON audit_logs (event_type);
CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_type, actor_id);
CREATE INDEX idx_audit_logs_target ON audit_logs (target_type, target_id);
CREATE INDEX idx_audit_logs_org_created ON audit_logs (organization_id, created_at) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

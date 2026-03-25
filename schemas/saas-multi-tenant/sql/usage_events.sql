-- usage_events: Append-only log of metered feature consumption per organization.
-- See README.md for full design rationale.

CREATE TABLE usage_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  feature_id      UUID NOT NULL REFERENCES features (id) ON DELETE CASCADE,
  quantity        INTEGER NOT NULL DEFAULT 1,
  user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
  metadata        JSONB,
  idempotency_key TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_events_org_feature_created ON usage_events (organization_id, feature_id, created_at);
CREATE INDEX idx_usage_events_idempotency_key     ON usage_events (idempotency_key);

-- webhook_messages: Append-only log of inbound/outbound webhook event payloads per organization.
-- See README.md for full design rationale.

CREATE TABLE webhook_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  event_type_id   UUID NOT NULL REFERENCES webhook_event_types (id) ON DELETE RESTRICT,
  event_id        TEXT NOT NULL,
  payload         JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_messages_org_created    ON webhook_messages (organization_id, created_at);
CREATE INDEX idx_webhook_messages_event_type_id  ON webhook_messages (event_type_id);
CREATE INDEX idx_webhook_messages_event_id       ON webhook_messages (event_id);

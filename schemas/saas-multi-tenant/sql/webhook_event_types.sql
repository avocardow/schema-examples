-- webhook_event_types: Catalogue of event types that can trigger webhook deliveries.
-- See README.md for full design rationale.

CREATE TABLE webhook_event_types (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key          TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  is_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_event_types_is_enabled ON webhook_event_types (is_enabled);

-- provider_webhook_events: Inbound webhook payloads from payment providers for idempotent processing.
-- See README.md for full design rationale.

CREATE TABLE provider_webhook_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_type     TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  event_type        TEXT NOT NULL,
  payload           JSONB NOT NULL,
  processed_at      TIMESTAMPTZ,
  processing_error  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (provider_type, provider_event_id)
);

CREATE INDEX idx_provider_webhook_events_event_type ON provider_webhook_events (event_type);
CREATE INDEX idx_provider_webhook_events_processed_at ON provider_webhook_events (processed_at);

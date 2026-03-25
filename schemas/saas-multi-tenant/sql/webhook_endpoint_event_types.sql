-- webhook_endpoint_event_types: Links webhook endpoints to the event types they subscribe to.
-- See README.md for full design rationale.

CREATE TABLE webhook_endpoint_event_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id   UUID NOT NULL,
  event_type_id UUID NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (endpoint_id, event_type_id)
);

CREATE INDEX idx_webhook_endpoint_event_types_event_type_id ON webhook_endpoint_event_types (event_type_id);

-- Forward FK: webhook_endpoints is defined in webhook_endpoints.sql (loaded after this file).
ALTER TABLE webhook_endpoint_event_types ADD CONSTRAINT fk_webhook_endpoint_event_types_endpoint
  FOREIGN KEY (endpoint_id) REFERENCES webhook_endpoints (id) ON DELETE CASCADE;

-- Forward FK: webhook_event_types is defined in webhook_event_types.sql (loaded after this file).
ALTER TABLE webhook_endpoint_event_types ADD CONSTRAINT fk_webhook_endpoint_event_types_event_type
  FOREIGN KEY (event_type_id) REFERENCES webhook_event_types (id) ON DELETE CASCADE;

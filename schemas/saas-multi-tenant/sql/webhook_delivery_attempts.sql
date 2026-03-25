-- webhook_delivery_attempts: Append-only log of each HTTP delivery attempt for a webhook message.
-- See README.md for full design rationale.

CREATE TYPE webhook_delivery_status AS ENUM ('pending', 'success', 'failed');

CREATE TABLE webhook_delivery_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id      UUID NOT NULL,
  endpoint_id     UUID NOT NULL,
  attempt_number  INTEGER NOT NULL DEFAULT 1,
  status          webhook_delivery_status NOT NULL DEFAULT 'pending',
  http_status     INTEGER,
  response_body   TEXT,
  error_message   TEXT,
  attempted_at    TIMESTAMPTZ,
  duration_ms     INTEGER,
  next_retry_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_delivery_attempts_message_attempt   ON webhook_delivery_attempts (message_id, attempt_number);
CREATE INDEX idx_webhook_delivery_attempts_endpoint_created  ON webhook_delivery_attempts (endpoint_id, created_at);
CREATE INDEX idx_webhook_delivery_attempts_status_retry      ON webhook_delivery_attempts (status, next_retry_at);

-- Forward FK: webhook_endpoints is defined in webhook_endpoints.sql (loaded after this file).
ALTER TABLE webhook_delivery_attempts ADD CONSTRAINT fk_webhook_delivery_attempts_endpoint
  FOREIGN KEY (endpoint_id) REFERENCES webhook_endpoints (id) ON DELETE CASCADE;

-- Forward FK: webhook_messages is defined in webhook_messages.sql (loaded after this file).
ALTER TABLE webhook_delivery_attempts ADD CONSTRAINT fk_webhook_delivery_attempts_message
  FOREIGN KEY (message_id) REFERENCES webhook_messages (id) ON DELETE CASCADE;

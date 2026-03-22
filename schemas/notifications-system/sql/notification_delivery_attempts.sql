-- notification_delivery_attempts: Per-notification, per-channel delivery attempt log with full audit trail and retry tracking.
-- See README.md for full design rationale and field documentation.

CREATE TYPE delivery_attempt_status_enum AS ENUM ('pending', 'queued', 'sent', 'delivered', 'bounced', 'failed');

CREATE TABLE notification_delivery_attempts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id       UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel_id            UUID NOT NULL REFERENCES notification_channels(id) ON DELETE RESTRICT,

  -- Delivery lifecycle: pending → queued → sent → delivered (or bounced/failed).
  status                delivery_attempt_status_enum NOT NULL DEFAULT 'pending',

  provider_message_id   TEXT,                           -- Provider's message ID for matching incoming webhooks.
  provider_response     JSONB,                          -- Raw provider response for debugging delivery issues.

  error_code            TEXT,                           -- Provider-specific error code (e.g., "550", "InvalidRegistration").
  error_message         TEXT,                           -- Human-readable error description.

  -- Retry tracking.
  attempt_number        INTEGER NOT NULL DEFAULT 1,    -- 1 = first try, 2 = first retry, etc.
  next_retry_at         TIMESTAMPTZ,                   -- When the next retry is scheduled. Null = no retry planned.

  sent_at               TIMESTAMPTZ,                   -- When the provider accepted the request.
  delivered_at          TIMESTAMPTZ,                   -- When delivery was confirmed (from provider webhook).
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_delivery_attempts_notification_id ON notification_delivery_attempts (notification_id);
CREATE INDEX idx_notification_delivery_attempts_channel_status ON notification_delivery_attempts (channel_id, status);
CREATE INDEX idx_notification_delivery_attempts_provider_message_id ON notification_delivery_attempts (provider_message_id);
CREATE INDEX idx_notification_delivery_attempts_status_retry ON notification_delivery_attempts (status, next_retry_at);
CREATE INDEX idx_notification_delivery_attempts_created_at ON notification_delivery_attempts (created_at);

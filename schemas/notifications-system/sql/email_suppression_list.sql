-- email_suppression_list: Email addresses that should not be sent to. Prevents bounces, spam complaints, and unsubscribe violations.
-- See README.md for full design rationale and field documentation.

CREATE TYPE suppression_reason_enum AS ENUM ('hard_bounce', 'soft_bounce', 'spam_complaint', 'manual_unsubscribe', 'invalid_address');
CREATE TYPE suppression_source_enum AS ENUM ('provider_webhook', 'user_action', 'admin', 'system');

CREATE TABLE email_suppression_list (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email           TEXT NOT NULL,                     -- The suppressed email address. Lowercase, trimmed.

  -- Why this address is suppressed.
  reason          suppression_reason_enum NOT NULL,  -- hard_bounce = permanent. soft_bounce = temporary. spam_complaint/manual_unsubscribe = respect immediately.

  -- How this suppression was created.
  source          suppression_source_enum NOT NULL,  -- provider_webhook, user_action, admin, or system.

  channel_id      UUID REFERENCES notification_channels(id) ON DELETE SET NULL, -- Which provider reported the suppression.

  details         JSONB,                             -- Provider-specific details for debugging.

  suppressed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When the suppression took effect. May differ from created_at if back-dated.
  expires_at      TIMESTAMPTZ,                       -- Null = permanent. Set for soft bounces that should be retried.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (email, reason)                             -- One entry per email per reason.
);

CREATE INDEX idx_email_suppression_list_email ON email_suppression_list (email);
CREATE INDEX idx_email_suppression_list_reason ON email_suppression_list (reason);
CREATE INDEX idx_email_suppression_list_expires_at ON email_suppression_list (expires_at);

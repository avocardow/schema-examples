-- notification_channels: Configured delivery provider instances for each channel type.
-- See README.md for full design rationale and field documentation.

CREATE TYPE channel_type_enum AS ENUM ('email', 'sms', 'push', 'in_app', 'chat', 'webhook');

CREATE TABLE notification_channels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What type of delivery channel this provider serves.
  channel_type    channel_type_enum NOT NULL,

  -- Which third-party provider powers this channel (e.g., 'sendgrid', 'twilio', 'fcm').
  provider        TEXT NOT NULL,

  name            TEXT NOT NULL,                    -- Display name (e.g., "SendGrid Production", "Twilio SMS").

  -- ⚠️  Provider credentials MUST be encrypted at rest.
  -- Contains API keys, auth tokens, webhook secrets — whatever the provider needs.
  credentials     JSONB NOT NULL,

  is_active       BOOLEAN NOT NULL DEFAULT TRUE,    -- Toggle a provider on/off without deleting its configuration.

  -- Primary flag: the default provider for this channel type.
  -- Only one channel per channel_type should be primary.
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,

  -- Failover priority: lower number = higher priority.
  priority        INTEGER NOT NULL DEFAULT 0,

  -- Provider-specific configuration that doesn't fit in credentials.
  config          JSONB DEFAULT '{}'::jsonb,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_channels_type_active ON notification_channels (channel_type, is_active);
CREATE INDEX idx_notification_channels_type_primary ON notification_channels (channel_type, is_primary);
CREATE INDEX idx_notification_channels_type_priority ON notification_channels (channel_type, priority);

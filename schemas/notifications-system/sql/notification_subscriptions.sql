-- notification_subscriptions: Links users to topics with per-channel granularity for fan-out delivery.
-- See README.md for full design rationale and field documentation.

-- Shared enum for channel types. Reused by notification_channels and other tables — if it already
-- exists (e.g., from a prior migration), skip this statement.
CREATE TYPE channel_type_enum AS ENUM ('email', 'sms', 'push', 'in_app', 'chat', 'webhook');

CREATE TABLE notification_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id        UUID NOT NULL REFERENCES notification_topics(id) ON DELETE CASCADE,

  -- Channel scope: which channel this subscription applies to.
  -- Null = subscribed on all channels. Set to a specific channel to subscribe only that channel.
  channel_type    channel_type_enum,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One subscription per user per topic per channel.
--
-- ⚠️  PostgreSQL treats NULL != NULL in unique indexes, so a plain
--     UNIQUE(user_id, topic_id, channel_type) will NOT prevent duplicate rows when channel_type
--     is NULL. We need two partial unique indexes — one for each case — to enforce uniqueness.

-- Case 1: channel_type is set (specific channel subscription).
CREATE UNIQUE INDEX uq_notification_subs_user_topic_chan
  ON notification_subscriptions (user_id, topic_id, channel_type)
  WHERE channel_type IS NOT NULL;

-- Case 2: channel_type is null (all-channels subscription).
CREATE UNIQUE INDEX uq_notification_subs_user_topic_null_chan
  ON notification_subscriptions (user_id, topic_id)
  WHERE channel_type IS NULL;

CREATE INDEX idx_notification_subscriptions_topic_id ON notification_subscriptions (topic_id);
CREATE INDEX idx_notification_subscriptions_user_id ON notification_subscriptions (user_id);

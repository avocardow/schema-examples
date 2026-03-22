-- notification_preferences: Per-user opt-in/opt-out controls for the category × channel preference matrix.
-- See README.md for full design rationale and field documentation.

-- Shared enum for channel types. Reused by notification_channels and other tables — if it already
-- exists (e.g., from a prior migration), skip this statement.
CREATE TYPE channel_type_enum AS ENUM ('email', 'sms', 'push', 'in_app', 'chat', 'webhook');

CREATE TABLE notification_preferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Category scope: which notification category this preference applies to.
  -- Null = global preference (applies to all categories that don't have a specific override).
  category_id     UUID REFERENCES notification_categories(id) ON DELETE CASCADE,

  -- Channel scope: which delivery channel this preference applies to.
  -- Null = all channels (applies to all channels that don't have a specific override).
  channel_type    channel_type_enum,

  -- The preference value. true = opted in, false = opted out.
  -- Does NOT override is_required categories — evaluate notification_categories.is_required first.
  enabled         BOOLEAN NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A user can have at most one preference per (category, channel) combination.
-- The four valid combinations:
--   (user, null,     null)    = global
--   (user, category, null)    = category-wide
--   (user, null,     channel) = channel-wide
--   (user, category, channel) = specific
--
-- ⚠️  PostgreSQL treats NULL != NULL in unique indexes, so a plain
--     UNIQUE(user_id, category_id, channel_type) will NOT prevent duplicate rows when either
--     nullable column is NULL. We need four partial unique indexes — one for each combination —
--     to enforce uniqueness across all four cases.

-- Case 1: both category_id and channel_type are set.
CREATE UNIQUE INDEX uq_notification_prefs_user_cat_chan
  ON notification_preferences (user_id, category_id, channel_type)
  WHERE category_id IS NOT NULL AND channel_type IS NOT NULL;

-- Case 2: category_id is set, channel_type is null (category-wide preference).
CREATE UNIQUE INDEX uq_notification_prefs_user_cat_null_chan
  ON notification_preferences (user_id, category_id)
  WHERE category_id IS NOT NULL AND channel_type IS NULL;

-- Case 3: category_id is null, channel_type is set (channel-wide preference).
CREATE UNIQUE INDEX uq_notification_prefs_user_null_cat_chan
  ON notification_preferences (user_id, channel_type)
  WHERE category_id IS NULL AND channel_type IS NOT NULL;

-- Case 4: both category_id and channel_type are null (global preference).
CREATE UNIQUE INDEX uq_notification_prefs_user_global
  ON notification_preferences (user_id)
  WHERE category_id IS NULL AND channel_type IS NULL;

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences (user_id);
CREATE INDEX idx_notification_preferences_user_category ON notification_preferences (user_id, category_id);

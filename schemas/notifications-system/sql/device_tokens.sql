-- device_tokens: Push notification device tokens and web push subscriptions.
-- See README.md for full design rationale and field documentation.

CREATE TYPE platform_enum AS ENUM ('ios', 'android', 'web', 'macos', 'windows');

CREATE TABLE device_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Platform: which type of device/browser this token is for.
  platform        platform_enum NOT NULL,

  -- The push token itself (opaque string from FCM, APNs, or web push endpoint).
  token           TEXT NOT NULL,

  -- Which push service provider issued/manages this token (e.g., "fcm", "apns", "web_push", "onesignal", "expo").
  provider        TEXT NOT NULL,

  -- App identifier for multi-app setups (e.g., Firebase project ID, APNs bundle ID). Null if only one app.
  app_id          TEXT,

  -- Web Push specific fields (RFC 8030 / VAPID). Null for native push tokens.
  p256dh_key      TEXT,                           -- ECDH P-256 public key from the browser.
  auth_key        TEXT,                           -- 16-byte authentication secret from the browser.
  endpoint_url    TEXT,                           -- Web push endpoint URL.

  -- Device metadata: useful for debugging and analytics.
  device_name     TEXT,                           -- e.g., "iPhone 15 Pro", "Chrome on MacBook".
  device_model    TEXT,                           -- e.g., "iPhone15,3", "Pixel 8".
  os_version      TEXT,                           -- e.g., "17.2", "14".
  app_version     TEXT,                           -- e.g., "2.1.0".

  is_active       BOOLEAN NOT NULL DEFAULT TRUE,  -- Set to false when the provider reports the token as invalid.
  last_used_at    TIMESTAMPTZ,                    -- When a push was last successfully sent to this token.
  expires_at      TIMESTAMPTZ,                    -- Some tokens have explicit expiry. Null = no known expiry.

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens (user_id);
CREATE INDEX idx_device_tokens_user_platform_active ON device_tokens (user_id, platform, is_active);
CREATE INDEX idx_device_tokens_token_provider ON device_tokens (token, provider);
CREATE INDEX idx_device_tokens_active_last_used ON device_tokens (is_active, last_used_at);

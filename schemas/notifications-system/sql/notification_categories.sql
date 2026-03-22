-- notification_categories: Classification of notification types for organizing preferences and routing to feeds.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,                    -- Display name (e.g., "Comments", "Billing", "Security Alerts").
  slug            TEXT UNIQUE NOT NULL,             -- Identifier used in code and API (e.g., "comments", "billing", "security").
  description     TEXT,                             -- Explain what triggers notifications in this category.
  color           TEXT,                             -- Hex color for UI display (e.g., "#3B82F6").
  icon            TEXT,                             -- Icon identifier or URL for UI display.

  -- Critical/required notifications bypass user preferences entirely.
  -- Security alerts, billing failures, legal notices, and account lockouts should be is_required=true.
  -- Users cannot opt out of required categories.
  is_required     BOOLEAN NOT NULL DEFAULT FALSE,

  -- Default feed: where notifications of this category appear.
  -- Null = no default feed (appears in all feeds).
  default_feed_id UUID REFERENCES notification_feeds(id) ON DELETE SET NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_categories_is_required ON notification_categories (is_required);

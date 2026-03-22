-- notification_template_contents: Per-channel content variants for a template (email, SMS, push, etc.).
-- See README.md for full design rationale and field documentation.

-- Shared enum for channel types. Reused by notification_channels and other tables — if it already
-- exists (e.g., from a prior migration), skip this statement.
CREATE TYPE channel_type_enum AS ENUM ('email', 'sms', 'push', 'in_app', 'chat', 'webhook');

CREATE TABLE notification_template_contents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     UUID NOT NULL REFERENCES notification_templates(id) ON DELETE CASCADE,

  -- Which channel this content is for.
  channel_type    channel_type_enum NOT NULL,

  -- Content fields. All are templates (interpolatable with event data).
  subject         TEXT,                              -- Email subject, push title. Not applicable for SMS or webhook.
  body            TEXT NOT NULL,                     -- The main content. HTML for email, plain text for SMS, structured for in-app.

  -- Channel-specific metadata as JSON. Keeps the table clean while supporting provider-specific fields.
  -- Email: { "preheader": "...", "reply_to": "...", "from_name": "..." }
  -- Push: { "icon": "...", "sound": "default", "badge_count": 1, "image_url": "..." }
  -- In-app: { "blocks": [...], "cta": { "url": "...", "label": "..." } }
  -- SMS: { "sender_id": "..." }
  -- Webhook: { "method": "POST", "headers": {...} }
  metadata        JSONB DEFAULT '{}'::jsonb,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One content variant per channel per template.
  UNIQUE (template_id, channel_type)
);

CREATE INDEX idx_notification_template_contents_template_id ON notification_template_contents (template_id);

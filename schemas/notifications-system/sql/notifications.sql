-- notifications: Per-recipient notification record. One row per recipient per event.
-- Tracks delivery status (provider hand-off) and engagement status (user interaction) as separate concerns.
-- See README.md for full design rationale and field documentation.

CREATE TYPE delivery_status_enum AS ENUM ('pending', 'queued', 'sent', 'delivered', 'failed', 'canceled');

CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES notification_events(id) ON DELETE CASCADE,

  -- Polymorphic recipient: who this notification is for.
  -- Not FKs — recipients can be any entity type (user, team, organization, channel).
  recipient_type    TEXT NOT NULL,                   -- e.g., "user", "team", "organization".
  recipient_id      TEXT NOT NULL,                   -- The recipient's ID.

  -- Why this person was notified (e.g., "mention", "assign", "review_requested", "subscription").
  reason            TEXT,

  delivery_status   delivery_status_enum NOT NULL DEFAULT 'pending',

  -- Engagement timestamps: nullable, can coexist. Timestamps over booleans — captures *when*, not just *whether*.
  seen_at           TIMESTAMPTZ,                     -- Appeared in the user's feed. Drives "unseen" badge count.
  read_at           TIMESTAMPTZ,                     -- User explicitly opened/clicked the notification.
  interacted_at     TIMESTAMPTZ,                     -- User performed the notification's primary action (e.g., clicked a CTA).
  archived_at       TIMESTAMPTZ,                     -- Soft archive. Hidden from default feed but still queryable.

  -- Expiration: inherited from the event or overridden per-notification.
  expires_at        TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_event_id ON notifications (event_id);
CREATE INDEX idx_notifications_recipient_read ON notifications (recipient_type, recipient_id, read_at);
CREATE INDEX idx_notifications_recipient_created ON notifications (recipient_type, recipient_id, created_at);
CREATE INDEX idx_notifications_recipient_seen ON notifications (recipient_type, recipient_id, seen_at);
CREATE INDEX idx_notifications_delivery_status ON notifications (delivery_status);
CREATE INDEX idx_notifications_expires_at ON notifications (expires_at);

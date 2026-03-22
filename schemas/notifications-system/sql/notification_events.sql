-- notification_events: Immutable event log — the trigger that causes notifications to be sent.
-- Append-only — one row per occurrence. No updated_at; if context changes, create a new event.
-- Uses polymorphic actor/target (TEXT, not FKs) so events survive entity deletion.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID NOT NULL REFERENCES notification_categories(id) ON DELETE RESTRICT,

  -- Polymorphic actor: who/what triggered this event (Activity Streams 2.0 pattern).
  -- Not FKs — actors can be any entity type.
  actor_type        TEXT,                           -- e.g., "user", "system", "api_key", "service". Null for system-generated events with no specific actor.
  actor_id          TEXT,                           -- The actor's ID.

  -- Polymorphic target: what was acted upon.
  -- Not FKs — targets can be any entity type.
  target_type       TEXT,                           -- e.g., "comment", "invoice", "pull_request".
  target_id         TEXT,                           -- The target's ID.

  -- Threading: lightweight grouping for related events.
  thread_key        TEXT,                           -- e.g., "issue:456", "pr:789". Free-form string.

  workflow_id       UUID REFERENCES notification_workflows(id) ON DELETE SET NULL,

  -- Event payload — single source of truth for rendering notification templates.
  data              JSONB DEFAULT '{}'::jsonb,

  -- Idempotency: prevent duplicate events from the same trigger.
  idempotency_key   TEXT UNIQUE,                    -- Null = no dedup (every trigger creates a new event).

  expires_at        TIMESTAMPTZ,                    -- Null = never expires.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_events_category_id ON notification_events (category_id);
CREATE INDEX idx_notification_events_actor ON notification_events (actor_type, actor_id);
CREATE INDEX idx_notification_events_target ON notification_events (target_type, target_id);
CREATE INDEX idx_notification_events_thread_key ON notification_events (thread_key);
CREATE INDEX idx_notification_events_created_at ON notification_events (created_at);

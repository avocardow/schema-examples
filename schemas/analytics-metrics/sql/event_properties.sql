-- event_properties: Key-value property pairs attached to events for flexible attribute storage.
-- See README.md for full design rationale.

CREATE TABLE event_properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,
  value         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, key)
);

CREATE INDEX idx_event_properties_key_value ON event_properties (key, value);

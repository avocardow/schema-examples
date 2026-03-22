-- event_types: Catalog of trackable event types with optional JSON schema validation.
-- See README.md for full design rationale.

CREATE TABLE event_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  category      TEXT,
  display_name  TEXT NOT NULL,
  description   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  schema        JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_types_category ON event_types (category);
CREATE INDEX idx_event_types_is_active ON event_types (is_active);

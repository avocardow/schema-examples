-- event_series: Groups recurring or related events into a named series.
-- See README.md for full design rationale.

CREATE TABLE event_series (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  recurrence_rule     TEXT,
  created_by          UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_series_created_by ON event_series (created_by);

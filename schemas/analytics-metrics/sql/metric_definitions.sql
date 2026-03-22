-- metric_definitions: Reusable metric definitions specifying aggregation logic and display formatting.
-- See README.md for full design rationale.

CREATE TYPE metric_aggregation AS ENUM ('count', 'sum', 'average', 'min', 'max', 'count_unique', 'percentile');

CREATE TABLE metric_definitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  description   TEXT,
  aggregation   metric_aggregation NOT NULL,
  event_type_id UUID REFERENCES event_types(id) ON DELETE SET NULL,
  property_key  TEXT,
  filters       JSONB,
  unit          TEXT,
  format        TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metric_definitions_event_type_id ON metric_definitions (event_type_id);
CREATE INDEX idx_metric_definitions_aggregation ON metric_definitions (aggregation);
CREATE INDEX idx_metric_definitions_is_active ON metric_definitions (is_active);
CREATE INDEX idx_metric_definitions_created_by ON metric_definitions (created_by);

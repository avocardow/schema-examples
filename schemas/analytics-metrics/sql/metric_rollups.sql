-- metric_rollups: Pre-computed metric aggregations at various time granularities for fast querying.
-- See README.md for full design rationale.

CREATE TYPE rollup_granularity AS ENUM ('hourly', 'daily', 'weekly', 'monthly');

CREATE TABLE metric_rollups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id     UUID NOT NULL REFERENCES metric_definitions(id) ON DELETE CASCADE,
  granularity   rollup_granularity NOT NULL,
  period_start  TIMESTAMPTZ NOT NULL,
  period_end    TIMESTAMPTZ NOT NULL,
  value         NUMERIC NOT NULL,
  count         BIGINT NOT NULL DEFAULT 0,
  dimensions    JSONB,
  computed_at   TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (metric_id, granularity, period_start, dimensions)
);

-- Leading columns of the unique index cover (metric_id, granularity, period_start)
CREATE INDEX idx_metric_rollups_period_start ON metric_rollups (period_start);

-- usage_summaries: Aggregated feature-usage totals per organization and billing period.
-- See README.md for full design rationale.

CREATE TABLE usage_summaries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  feature_id      UUID        NOT NULL REFERENCES features (id) ON DELETE CASCADE,
  period_start    TIMESTAMPTZ NOT NULL,
  period_end      TIMESTAMPTZ NOT NULL,
  total_quantity  BIGINT      NOT NULL DEFAULT 0,
  event_count     INTEGER     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, feature_id, period_start)
);

CREATE INDEX idx_usage_summaries_period ON usage_summaries (period_start, period_end);

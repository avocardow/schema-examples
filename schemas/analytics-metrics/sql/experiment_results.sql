-- experiment_results: Statistical results per variant and metric including confidence intervals and significance.
-- See README.md for full design rationale.

CREATE TABLE experiment_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  variant_id    UUID NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE,
  metric_id     UUID NOT NULL REFERENCES metric_definitions(id) ON DELETE CASCADE,
  sample_size   BIGINT NOT NULL DEFAULT 0,
  mean_value    NUMERIC,
  stddev        NUMERIC,
  ci_lower      NUMERIC,
  ci_upper      NUMERIC,
  p_value       NUMERIC,
  lift          NUMERIC,
  is_significant BOOLEAN NOT NULL DEFAULT FALSE,
  computed_at   TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (experiment_id, variant_id, metric_id)
);

-- Leading column of the unique index covers (experiment_id)

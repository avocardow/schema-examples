-- experiment_variants: Control and treatment variants within an experiment with traffic weights.
-- See README.md for full design rationale.

CREATE TABLE experiment_variants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  is_control    BOOLEAN NOT NULL DEFAULT FALSE,
  weight        NUMERIC NOT NULL DEFAULT 0.5,
  config        JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (experiment_id, name)
);

-- Leading column of the unique index covers (experiment_id)

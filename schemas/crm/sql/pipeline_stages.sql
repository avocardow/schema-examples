-- pipeline_stages: Ordered stages within a pipeline representing deal progression.
-- See README.md for full design rationale.

CREATE TABLE pipeline_stages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id     UUID NOT NULL REFERENCES pipelines (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  position        INTEGER NOT NULL DEFAULT 0,
  win_probability INTEGER,
  is_closed_won   BOOLEAN NOT NULL DEFAULT FALSE,
  is_closed_lost  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pipeline_stages_pipeline_pos ON pipeline_stages (pipeline_id, position);

-- pipelines: Named sales pipelines that group stages for deal tracking.
-- See README.md for full design rationale.

CREATE TABLE pipelines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pipelines_position ON pipelines (position);

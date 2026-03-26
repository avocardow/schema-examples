-- control_requirements: Maps controls to framework requirements they satisfy.
-- See README.md for full design rationale.

CREATE TABLE control_requirements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id     UUID NOT NULL REFERENCES controls (id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (control_id, requirement_id)
);

-- Forward FK: framework_requirements loads after control_requirements alphabetically.
ALTER TABLE control_requirements
  ADD CONSTRAINT fk_control_requirements_requirement
  FOREIGN KEY (requirement_id) REFERENCES framework_requirements (id) ON DELETE CASCADE;

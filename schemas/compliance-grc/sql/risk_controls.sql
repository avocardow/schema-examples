-- risk_controls: Maps risks to the controls that mitigate them.
-- See README.md for full design rationale.

CREATE TABLE risk_controls (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id             UUID NOT NULL REFERENCES risks (id) ON DELETE CASCADE,
  control_id          UUID NOT NULL REFERENCES controls (id) ON DELETE CASCADE,
  effectiveness_notes TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (risk_id, control_id)
);

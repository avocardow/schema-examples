-- funnel_steps: Ordered event-based steps within a conversion funnel.
-- See README.md for full design rationale.

CREATE TABLE funnel_steps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id     UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE RESTRICT,
  step_order    INTEGER NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (funnel_id, step_order),
  UNIQUE (funnel_id, event_type_id)
);

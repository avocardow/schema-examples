-- goals: Conversion goals defined by event type, page view pattern, or custom criteria.
-- See README.md for full design rationale.

CREATE TYPE goal_type AS ENUM ('event', 'page_view', 'custom');

CREATE TABLE goals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  goal_type     goal_type NOT NULL,
  event_type_id UUID REFERENCES event_types(id) ON DELETE SET NULL,
  url_pattern   TEXT,
  value         NUMERIC,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_goal_type ON goals (goal_type);
CREATE INDEX idx_goals_event_type_id ON goals (event_type_id);
CREATE INDEX idx_goals_is_active ON goals (is_active);
CREATE INDEX idx_goals_created_by ON goals (created_by);

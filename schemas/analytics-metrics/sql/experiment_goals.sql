-- experiment_goals: Links experiments to conversion goals, designating one as primary.
-- See README.md for full design rationale.

CREATE TABLE experiment_goals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  goal_id       UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (experiment_id, goal_id)
);

CREATE INDEX idx_experiment_goals_goal_id ON experiment_goals (goal_id);

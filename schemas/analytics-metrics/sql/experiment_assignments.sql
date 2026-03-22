-- experiment_assignments: Records which users or anonymous visitors are assigned to which variant.
-- See README.md for full design rationale.

CREATE TABLE experiment_assignments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  variant_id    UUID NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id  TEXT,
  assigned_at   TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (experiment_id, user_id)
);

-- Leading column of the unique index covers (experiment_id)
CREATE INDEX idx_experiment_assignments_experiment_id_variant_id ON experiment_assignments (experiment_id, variant_id);
CREATE INDEX idx_experiment_assignments_user_id ON experiment_assignments (user_id);
CREATE INDEX idx_experiment_assignments_assigned_at ON experiment_assignments (assigned_at);

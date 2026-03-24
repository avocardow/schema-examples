-- milestones: Time-boxed goals that group tasks into deliverable phases.
-- See README.md for full design rationale.

CREATE TYPE milestone_status AS ENUM ('planned', 'active', 'completed', 'cancelled');

CREATE TABLE milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  status      milestone_status NOT NULL DEFAULT 'planned',
  start_date  TEXT,
  end_date    TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_project_status ON milestones (project_id, status);
CREATE INDEX idx_milestones_project_position ON milestones (project_id, position);

-- Forward FK: projects loads after this file alphabetically.
ALTER TABLE milestones
  ADD CONSTRAINT fk_milestones_project
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

-- project_statuses: Customizable workflow states for tasks within a project.
-- See README.md for full design rationale.

CREATE TYPE status_category AS ENUM ('backlog', 'unstarted', 'started', 'completed', 'cancelled');

CREATE TABLE project_statuses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL,
  name        TEXT NOT NULL,
  color       TEXT,
  category    status_category NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_statuses_project_position ON project_statuses (project_id, position);
CREATE INDEX idx_project_statuses_project_category ON project_statuses (project_id, category);

-- Forward FK: projects is defined in projects.sql (loaded after this file).
ALTER TABLE project_statuses
  ADD CONSTRAINT fk_project_statuses_project
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

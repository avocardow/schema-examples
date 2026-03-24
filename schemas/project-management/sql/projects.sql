-- projects: Top-level containers that organize tasks, members, and settings.
-- See README.md for full design rationale.

CREATE TYPE project_visibility AS ENUM ('public', 'private');

CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  key         TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  visibility  project_visibility NOT NULL DEFAULT 'public',
  task_count  INTEGER NOT NULL DEFAULT 0,
  created_by  UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_created_by ON projects (created_by);

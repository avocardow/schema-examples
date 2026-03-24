-- task_views: Saved views with layout, filter, and sort configurations for tasks.
-- See README.md for full design rationale.

CREATE TYPE view_layout AS ENUM ('list', 'board', 'calendar', 'timeline');

CREATE TABLE task_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  created_by  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  layout      view_layout NOT NULL DEFAULT 'list',
  filters     JSONB,
  sort_by     JSONB,
  group_by    TEXT,
  is_shared   BOOLEAN NOT NULL DEFAULT FALSE,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_views_project_position ON task_views (project_id, position);
CREATE INDEX idx_task_views_created_by ON task_views (created_by);

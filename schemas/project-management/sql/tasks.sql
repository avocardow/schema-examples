-- tasks: Individual work items with status, priority, and hierarchical subtask support.
-- See README.md for full design rationale.

CREATE TYPE task_type AS ENUM ('task', 'bug', 'story', 'epic');
CREATE TYPE task_priority AS ENUM ('none', 'urgent', 'high', 'medium', 'low');

CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  task_list_id    UUID REFERENCES task_lists (id) ON DELETE SET NULL,
  parent_id       UUID REFERENCES tasks (id) ON DELETE CASCADE,
  status_id       UUID REFERENCES project_statuses (id) ON DELETE SET NULL,
  milestone_id    UUID REFERENCES milestones (id) ON DELETE SET NULL,
  number          INTEGER NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  type            task_type NOT NULL DEFAULT 'task',
  priority        task_priority NOT NULL DEFAULT 'none',
  due_date        TEXT,
  start_date      TEXT,
  estimate_points INTEGER,
  position        INTEGER NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (project_id, number)
);

CREATE INDEX idx_tasks_project_status ON tasks (project_id, status_id);
CREATE INDEX idx_tasks_task_list_position ON tasks (task_list_id, position);
CREATE INDEX idx_tasks_parent ON tasks (parent_id);
CREATE INDEX idx_tasks_milestone ON tasks (milestone_id);
CREATE INDEX idx_tasks_type ON tasks (type);
CREATE INDEX idx_tasks_due_date ON tasks (due_date);
CREATE INDEX idx_tasks_created_by ON tasks (created_by);

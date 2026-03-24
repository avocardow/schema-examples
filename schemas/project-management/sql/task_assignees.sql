-- task_assignees: Junction table linking tasks to their assigned users with roles.
-- See README.md for full design rationale.

CREATE TYPE assignee_role AS ENUM ('assignee', 'reviewer');

CREATE TABLE task_assignees (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL,
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role       assignee_role NOT NULL DEFAULT 'assignee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (task_id, user_id)
);

CREATE INDEX idx_task_assignees_user ON task_assignees (user_id);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE task_assignees
  ADD CONSTRAINT fk_task_assignees_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;

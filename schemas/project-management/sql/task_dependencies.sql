-- task_dependencies: Directed relationships between tasks for scheduling and blocking.
-- See README.md for full design rationale.

CREATE TYPE dependency_type AS ENUM ('blocks', 'is_blocked_by', 'relates_to', 'duplicates');

CREATE TABLE task_dependencies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       UUID NOT NULL,
  depends_on_id UUID NOT NULL,
  type          dependency_type NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (task_id, depends_on_id, type)
);

CREATE INDEX idx_task_dependencies_depends_on ON task_dependencies (depends_on_id);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE task_dependencies
  ADD CONSTRAINT fk_task_dependencies_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;

ALTER TABLE task_dependencies
  ADD CONSTRAINT fk_task_dependencies_depends_on
  FOREIGN KEY (depends_on_id) REFERENCES tasks (id) ON DELETE CASCADE;

-- task_activities: Immutable audit log tracking every change made to a task.
-- See README.md for full design rationale.

CREATE TYPE task_action AS ENUM ('created', 'updated', 'commented', 'assigned', 'unassigned', 'labeled', 'unlabeled', 'moved', 'archived', 'restored');

CREATE TABLE task_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL,
  user_id    UUID REFERENCES users (id) ON DELETE SET NULL,
  action     task_action NOT NULL,
  field      TEXT,
  old_value  TEXT,
  new_value  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_activities_task_created ON task_activities (task_id, created_at);
CREATE INDEX idx_task_activities_user ON task_activities (user_id);

-- Forward FK: tasks loads after this file alphabetically.
ALTER TABLE task_activities
  ADD CONSTRAINT fk_task_activities_task
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;
